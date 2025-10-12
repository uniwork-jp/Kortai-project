# AI Assistant バックエンド

このディレクトリには、AI AssistantアプリケーションのFirebase Functionsバックエンドが含まれており、REST APIエンドポイント、Firestoreトリガー、スケジュール関数を提供します。

## 📁 ディレクトリ構造

```
apps/backend/
├── firebase.json          # Firebaseプロジェクト設定
└── functions/             # Firebase Functionsソースコード
    ├── package.json       # 依存関係とスクリプト
    ├── tsconfig.json      # TypeScript設定
    ├── README.md          # 関数固有のドキュメント
    ├── src/
    │   └── index.ts       # メイン関数ファイル
    └── _tests_/           # テストスイート
        ├── fixtures/      # モックデータとテストフィクスチャ
        ├── unit/          # 個別関数のユニットテスト
        ├── integration/   # 統合テスト
        └── utils/         # テストユーティリティとヘルパー
```

## 🚀 はじめに

### 前提条件

- Node.js 18+
- pnpm (推奨パッケージマネージャー)
- Firebase CLI
- Firebaseプロジェクトの設定

### インストール

1. functionsディレクトリに移動：
   ```bash
   cd apps/backend/functions
   ```

2. 依存関係をインストール：
   ```bash
   pnpm install
   ```

3. 関数をビルド：
   ```bash
   pnpm run build
   ```

### pnpmについて

このプロジェクトでは高速で効率的なパッケージマネージャーであるpnpmを使用しています。pnpmの利点：

- **高速**: npmやyarnより高速なインストール
- **効率的**: ディスク容量の節約
- **厳密**: phantom dependenciesを防ぐ
- **互換性**: npmコマンドと互換性あり

pnpmがインストールされていない場合は、以下のコマンドでインストールできます：
```bash
npm install -g pnpm
```

## 🛠️ 利用可能なスクリプト

| スクリプト | 説明 |
|--------|-------------|
| `pnpm run build` | TypeScriptをJavaScriptにコンパイル |
| `pnpm run build:watch` | 開発用ウォッチモード |
| `pnpm run serve` | Firebaseエミュレーターを開始 |
| `pnpm run shell` | Firebase Functionsシェルを開始 |
| `pnpm run deploy` | Firebaseに関数をデプロイ |
| `pnpm run logs` | 関数ログを表示 |
| `pnpm test` | テストスイートを実行 |
| `pnpm run test:watch` | ウォッチモードでテストを実行 |
| `pnpm run test:coverage` | テストカバレッジレポートを生成 |

## 📡 APIエンドポイント

### ヘルスチェック
- **GET** `/health` - サービスヘルスステータス

### ユーザー
- **GET** `/api/users` - すべてのユーザーを取得
- **GET** `/api/users/:id` - IDでユーザーを取得
- **POST** `/api/users` - 新しいユーザーを作成

### チャット
- **GET** `/api/chat` - チャットメッセージを取得（`userId`と`limit`クエリパラメータをサポート）
- **POST** `/api/chat` - チャットメッセージを送信

### AIレスポンス
- **GET** `/api/ai-responses` - AIレスポンスを取得（`model`と`limit`クエリパラメータをサポート）
- **POST** `/api/ai-responses` - AIレスポンスを生成

## 🔧 Firebase Functions

### HTTP Functions
- `api` - すべてのRESTエンドポイントを持つメインExpressアプリ
- `healthCheck` - スタンドアロンヘルスチェックエンドポイント

### Firestore Triggers
- `onUserCreate` - 新しいユーザードキュメントが作成されたときにトリガー

### Scheduled Functions
- `dailyCleanup` - クリーンアップタスクのために毎日午前2時（UTC）に実行

## 🧪 テスト

プロジェクトには、以下のように整理された包括的なテストスイートが含まれています：

### テスト構造
- **ユニットテスト** (`_tests_/unit/`) - 個別の関数を分離してテスト
- **統合テスト** (`_tests_/integration/`) - 関数間の相互作用をテスト
- **フィクスチャ** (`_tests_/fixtures/`) - モックデータとテストフィクスチャ
- **ユーティリティ** (`_tests_/utils/`) - テストユーティリティとヘルパー

### テストの実行

```bash
# すべてのテストを実行
pnpm test

# ウォッチモードでテストを実行
pnpm run test:watch

# カバレッジレポートを生成
pnpm run test:coverage

# 特定のテストファイルを実行
pnpm test -- users.test.ts

# パターンに一致するテストを実行
pnpm test -- --testNamePattern="User"
```

### テストカテゴリ

#### ユニットテスト
- `health.test.ts` - ヘルスチェックエンドポイント
- `users.test.ts` - ユーザー管理エンドポイント
- `chat.test.ts` - チャット機能
- `aiResponses.test.ts` - AIレスポンス生成
- `triggers.test.ts` - Firestoreトリガーとスケジュール関数

## 🔧 開発

### ローカル開発

1. Firebaseエミュレーターを開始：
   ```bash
   pnpm run serve
   ```

2. APIは以下の場所で利用可能：
   ```
   http://localhost:5001/{project-id}/{region}/api
   ```

### 環境変数

`firebase.json`でFirebaseプロジェクト設定をセットアップ：

```json
{
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}
```

### コード構造

メイン関数ファイル（`src/index.ts`）には以下が含まれています：

- **インターフェース**: データモデルのTypeScriptインターフェース
- **モックデータ**: 開発とテスト用のサンプルデータ
- **Expressルート**: REST APIエンドポイントの実装
- **Firebase Functions**: HTTP、Firestore、スケジュール関数

## 🚀 デプロイ

### Firebaseへのデプロイ

```bash
# すべての関数をデプロイ
pnpm run deploy

# 特定の関数をデプロイ
firebase deploy --only functions:api

# 環境変数と一緒にデプロイ
firebase functions:config:set app.environment="production"
pnpm run deploy
```

### 環境設定

環境固有の設定を構成：

```bash
# 設定値を設定
firebase functions:config:set app.api_key="your-api-key"

# 現在の設定を表示
firebase functions:config:get
```

## 📊 モニタリング

### ログの表示

```bash
# すべての関数ログを表示
pnpm run logs

# 特定の関数のログを表示
firebase functions:log --only api

# リアルタイムでログをフォロー
firebase functions:log --follow
```

### パフォーマンスモニタリング

Firebaseコンソールで関数のパフォーマンスをモニタリング：
- 関数実行時間
- メモリ使用量
- エラー率
- 呼び出し回数

## 🔒 セキュリティ

### 認証

現在、関数はモックデータを使用しています。本番環境では以下を実装してください：

- Firebase Authentication
- リクエスト検証
- レート制限
- CORS設定

### データ検証

すべてのエンドポイントには以下が含まれています：
- 入力検証
- エラーハンドリング
- 型チェック
- レスポンスフォーマット

## 🤝 コントリビューション

1. フィーチャーブランチを作成
2. 新機能のテストを記述
3. すべてのテストが通ることを確認
4. ドキュメントを更新
5. プルリクエストを提出

## 📝 ライセンス

このプロジェクトはAI Assistantアプリケーションの一部です。ライセンス情報については、メインプロジェクトのREADMEを参照してください。
