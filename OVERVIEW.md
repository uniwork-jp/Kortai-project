# LIFF × Gmail 秘書BOT

**スタック**: Turborepo (Monorepo) + Next.js (App Router) + Firebase (Firestore / Cloud Functions / Hosting) + LINE Official Account (LIFF) + Google Gmail API (Pub/Sub watch) + OpenAI（任意：文章校正）

## 概要

LINEのLIFF内で動くフロントエンドとサーバー側（Firebase）を組み合わせ、Gmailの新着を検知してLINE公式アカウントからユーザーにPush通知を送る秘書BOTです。ユーザーはLIFF上でメールを閲覧・返信でき、音声入力→AIで校正→送信 というワークフローを実装できます。

**要点**

* LIFFはUI（メール一覧、本文、返信UI、音声入力）を提供
* Gmailの新着検知は Gmail API の `watch`（Pub/Sub）を利用
* Pub/Sub通知は Firebase Cloud Functions が受け取り、LINE Messaging API の Push Message でユーザーへ通知
* ユーザーはLIFFでLINEログイン→Google OAuthでGmailアクセス権を与える（トークンはサーバー側で管理）

---

## 目次

1. 事前準備
2. リポジトリ構成（推奨）
3. 環境変数
4. ローカル開発手順
5. デプロイ手順（Firebase / Vercel）
6. 主要コンポーネント詳細
7. セキュリティ／運用メモ
8. TODO / 拡張案

---

## 1. 事前準備

### Google Cloud

1. プロジェクト作成
2. Gmail API を有効化
3. OAuth 2.0 クライアントID を作成（Webアプリ用）。リダイレクトURI にサーバーのエンドポイント（例: `https://your-domain.com/api/oauth/callback`）を登録
4. Pub/Sub を有効化
5. サービスアカウントを作成し、必要ならPub/Subの Subscriber権限を付与。キーファイル（JSON）は Firebase Functions で使うか、Firebase プロジェクトに紐づける
6. Gmail の `watch` を登録する際に使う Pub/Sub topic を作る

> NOTE: 本番ではOAuthクライアントは慎重に設定し、公開ドメイン（HTTPS）を使ってください。

### LINE

1. LINE Official Account を作成
2. Messaging API チャネルを作成
3. チャネルアクセストークン（長期）・チャネルシークレットを取得
4. LIFF アプリを作成し、必要な LIFF URL を登録

### Firebase

1. Firebase プロジェクト作成（同じ Google Cloud プロジェクトでも可）
2. Firestore を有効化（トークン／ユーザーデータ保存用）
3. Cloud Functions を有効化
4. Firebase Hosting（LIFF の公開URLや PWA をここでホストしても良い）

---

## 2. 推奨リポジトリ構成（Turborepo）

```
/ (root - turborepo)
├─ apps/
│  ├─ web/           # Next.js (LIFF フロントエンド) - App Router
│  └─ api/           # Next.js API (optional) or functions wrapper
├─ packages/
│  ├─ ui/            # 共有 UI コンポーネント
│  └─ shared/        # types, utils, proto types
├─ functions/        # Firebase Cloud Functions (PubSub handler, cron jobs)
└─ infra/            # firebase.json, firestore.rules, GCP terraform 等
```

---

## 3. 環境変数（例）

```
# サーバー / Functions
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_PUBSUB_TOPIC=projects/your-project/topics/gmail-watch
LINE_CHANNEL_SECRET=xxxx
LINE_CHANNEL_ACCESS_TOKEN=xxxx
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_SERVICE_ACCOUNT=/path/to/key.json # or use firebase deploy auth
JWT_SIGNING_KEY=xxxx (optional)

# Next (LIFF web)
NEXT_PUBLIC_LIFF_ID=your-liff-id
NEXT_PUBLIC_API_BASE=https://your-api.example.com
```

---

## 4. ローカル開発手順

### 必要ソフト

* Node.js (推奨16+)
* pnpm (turbo と互換性が高い)
* Firebase CLI

### ステップ

1. リポジトリをクローン

```bash
pnpm install
```

2. 環境変数を `.env.local` に配置
3. Next.js (LIFF) を起動

```bash
pnpm --filter=@yourorg/web dev
```

4. Firebase Functions のエミュレータ起動（Pub/Sub エミュレーション含む）

```bash
firebase emulators:start --only functions,firestore
```

5. LINE LIFF は `NEXT_PUBLIC_LIFF_ID` を使って LIFF を生成し、LINE Developer Console に登録した URL にデプロイ

---

## 5. デプロイ手順（概略）

### Frontend (LIFF)

* ビルド: `pnpm --filter=@yourorg/web build`
* デプロイ方法：Firebase Hosting または Vercel へ

  * LIFF で参照する URL は https の公開 URL が必要

### Cloud Functions

* `functions` ディレクトリで

```bash
firebase deploy --only functions
```

* Pub/Sub トピックの権限を Functions サービスアカウントに付与

### Gmail watch の登録

* サーバー（Functions または API）から Gmail API の `watch` を呼ぶ。引数に `topicName`（Pub/Sub topic）を指定
* 各ユーザーの Gmail 時計測はユーザーごとに実行（ユーザーが初回で Google OAuth を許可した後に登録）

---

## 6. 主要コンポーネント詳細

### A. LIFF (Next.js)

* 機能: LINEログイン、Google OAuth 連携開始、受信メール一覧表示、メール本文詳細、返信UI、音声入力（Web Speech API）、プレビュー、送信
* LIFF 起動時フロー:

  1. LINE ログインで `lineUserId` を取得
  2. ユーザーが「Gmailと連携」ボタンを押す -> Google OAuth フローへ
  3. OAuth 成功後、サーバーへ `lineUserId` と Google トークンを紐づけて保存

### B. OAuth フロー（サーバー側）

* 推奨: Authorization Code（PKCE）
* サーバーは `code` を受け取り、`refresh_token` を含めて安全に保存
* トークンは Firestore の `users/{lineUserId}` ドキュメント等に保存（暗号化/アクセス制限を実施）

### C. Gmail Watch → Pub/Sub → Cloud Functions

1. 各ユーザーで `watch` を登録（`gmail.users.watch`）: 新着が有れば Pub/Sub に通知
2. Pub/Sub トピックに通知が来ると Firebase Cloud Function が起動
3. Function は通知 payload から `historyId` 等を取り、新着のメッセージIDを Gmail API で取得
4. 取得した新着情報をもとに、Firestore の `users/{lineUserId}` を参照して `lineUserId` を特定

   * Gmail メタ情報とLineUserIdのマッピングは、ユーザー連携時に保存しておく
5. LINE Messaging API の Push Message（`/v2/bot/message/push`）を呼んでユーザーへ通知

   * メッセージ例: 「新着メール: 差出人 — 件名」 + LIFF を開くボタン（`actions`でLIFF URL）

### D. 返信フロー

* ユーザーが LIFF で返信を確定 -> Next API (または Cloud Function) 経由で Gmail API に `messages/send` または `drafts.create` を呼ぶ
* 送信前にOpenAI等で文章校正する場合、API を挟む

---

## 7. セキュリティ／運用メモ

* **トークン管理**: refresh\_token 等は暗号化して保存（KMS 連携を推奨）
* **LINE Push の同意**: LINE で Push を受け取るにはユーザーが公式アカウントを友だち追加している必要あり。LIFF内で友だち追加・説明を必ず促す
* **スケーリング**: 大量の Gmail watch を管理すると Pub/Sub のメッセージ量が増える。Cloud Functions のスケーリング設定や費用見積りを行う
* **エラーハンドリング**: Gmail API の 401/403（トークン無効）であればユーザーに再連携を促すフローを用意
* **監査ログ**: 送信アクションや Push 送信は監査用にログを残す（Firestore or BigQuery）

---

## 8. TODO / 拡張案

* Push 通知のレベル分け（重要度が高いメールのみ通知）
* 受信トレイの自動ラベル付け＋優先度判定（AI判定）
* 既読操作（LIFFから既読フラグ更新）
* スレッド表示／添付ファイルのプレビュー
* PWA を作って Web Push を併用する（LINE と併用）

---

## 参考コマンド（よく使う）

```bash
# turborepo ルートで依存インストール
pnpm install

# web を開発モードで起動
pnpm --filter=@yourorg/web dev

# functions をデプロイ
cd functions
firebase deploy --only functions

# firestore ルール確認
firebase emulators:start --only firestore
```

---

## 最後に

この README は設計書兼導入手順の雛形です。実際の実装では Google の各種権限・Quota と LINE の利用規約を確認のうえ、ユーザーの同意フロー（友だち追加・Gmail権限付与）を丁寧に作ることが成功の鍵です。

必要なら「実装テンプレ（Next API / Functions のサンプルコード）」や「LIFF 側の具体的な画面フロー」を追加で作成します。どれから出しますか？
