# AI Assistant モノレポ

Turborepoで構築されたモダンなモノレポで、複数のNext.jsフロントエンドアプリケーションとバックエンドサービスを含みます。

## 📚 ドキュメントリンク

- **[プロジェクト概要](OVERVIEW.md)** - 包括的なプロジェクト概要とアーキテクチャ
- **[環境セットアップ](ENVIRONMENT_SETUP.md)** - ステップバイステップの環境設定ガイド
- **[環境構成](ENVIRONMENT_CONFIG.md)** - ローカル・STG・PROD環境の構成詳細
- **[パッケージスクリプトリファレンス](PACKAGE_SCRIPTS.md)** - 利用可能なすべてのコマンドの完全ガイド
- **[フロントエンドドキュメント](apps/frontend/FRONTEND.md)** - フロントエンドアプリケーションガイド
- **[バックエンドドキュメント](apps/backend/BACKEND.md)** - バックエンドサービスドキュメント
- **[OpenAPI型ガイド](openapi/TYPES.md)** - API型生成とスキーマ管理のガイド
- **[共通コンポーネント](packages/components/COMMON_COMPONENTS.md)** - 共有Reactコンポーネントライブラリ
- **[認証ガイド](AUTH.md)** - 認証と認可のセットアップ
- **[Cloud Functions API](apps/backend/functions/CLOUD_FUNCTIONS.md)** - Firebase Cloud Functions API ガイド
- **[Terraform Infrastructure](apps/backend/infra/TERRAFORM_GUIDE.md)** - GCPインフラストラクチャ管理ガイド
- **[モックサーバーガイド](scripts/mock-server/MOCK_SERVER.md)** - モックサーバーユーティリティ
- **[LIFFモックプロバイダー](packages/liff-mock/LIFF_MOCK.md)** - ローカル開発用のモックLIFF SDK

## 📁 プロジェクト構造

```
AI-Assistant/
├── apps/                     # アプリケーションディレクトリ
│   ├── backend/             # バックエンドAPIサービス
│   │   ├── firebase.json    # Firebase設定
│   │   ├── BACKEND.md       # バックエンドドキュメント
│   │   ├── functions/       # Firebase Functions
│   │   │   ├── package.json
│   │   │   ├── CLOUD_FUNCTIONS.md # Cloud Functions API ガイド
│   │   │   ├── src/
│   │   │   │   └── index.ts
│   │   │   ├── vercel.json  # vercel設定
│   │   │   └── tsconfig.json
│   │   └── infra/           # Terraform Infrastructure
│   │       ├── provider.tf  # GCPプロバイダー設定
│   │       ├── modules/     # 再利用可能なモジュール
│   │       │   ├── firestore/  # Firestoreモジュール
│   │       │   ├── functions/  # Cloud Functionsモジュール
│   │       │   └── iam/        # IAMモジュール
│   │       ├── environments/   # 環境別設定
│   │       │   ├── staging/    # ステージング環境
│   │       │   └── prod/       # 本番環境
│   │       └── TERRAFORM_GUIDE.md # Terraformガイド
│   └── frontend/            # フロントエンドアプリケーション
│       ├── app/             # メインフロントエンドアプリ
│       │   ├── package.json
│       │   ├── APP.md       # アプリドキュメント
│       │   └── HTTPS_SETUP.md # HTTPSセットアップガイド
│       └── FRONTEND.md      # フロントエンドドキュメント
├── packages/                # 共有パッケージ
│   ├── components/          # 共通Reactコンポーネント
│   │   ├── COMMON_COMPONENTS.md # コンポーネントドキュメント
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── BackgroundContainer.tsx
│   │   │   ├── MobileContainer.tsx
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   ├── config/              # 設定ユーティリティ
│   │   └── env.ts
│   ├── liff-mock/           # LIFFモックプロバイダー
│   │   ├── LIFF_MOCK.md     # モックプロバイダードキュメント
│   │   ├── package.json
│   │   └── src/
│   └── utils/               # ユーティリティ関数
│       └── firebaseClient.ts
├── openapi/                 # OpenAPIドキュメント
│   ├── API_MAP.md           # APIマッピングドキュメント
│   ├── TYPES.md             # 型生成ガイド
│   └── schema.yaml          # OpenAPIスキーマ
├── scripts/                 # 開発スクリプト
│   └── mock-server/         # モックサーバーユーティリティ
│       └── MOCK_SERVER.md   # モックサーバードキュメント
├── AUTH.md                  # 認証ドキュメント
├── ENVIRONMENT_SETUP.md     # 環境セットアップガイド
├── OVERVIEW.md              # プロジェクト概要
├── PACKAGE_SCRIPTS.md       # パッケージスクリプトリファレンス
├── package.json             # ルートpackage.json
├── README.md                # このファイル
└── turbo.json              # Turborepo設定
```

## 🚀 はじめに

### 前提条件

- Node.js 22.11.0+ 
- pnpm 8.0.0+

### インストール

1. リポジトリをクローン:
```bash
git clone <your-repo-url>
cd ai-assistant-monorepo
```

2. 依存関係をインストール:
```bash
pnpm install
```

## 🛠️ 開発

### すべてのアプリケーションを開発モードで実行:
```bash
pnpm dev
```

これにより、すべてのフロントエンドアプリケーションとバックエンドサービスが同時に起動します。

### 特定のアプリケーションを実行:

#### フロントエンドアプリケーション:
- **フロントエンドアプリ**: `pnpm dev:app` または `pnpm dev --filter=@ai-assistant/frontend`

#### バックエンド:
```bash
pnpm dev:backend
```

### アプリケーションへのアクセス:

- **フロントエンドアプリ**: http://localhost:3000 (`pnpm dev:app`実行時)
- **バックエンドAPI**: http://localhost:5001 (Firebase Functionsエミュレーター)

## 📦 利用可能なスクリプト

### ルートレベルコマンド:
- `pnpm build` - すべてのアプリケーションをビルド
- `pnpm dev` - すべてのアプリケーションを開発モードで起動
- `pnpm lint` - すべてのアプリケーションをリント
- `pnpm test` - すべてのアプリケーションのテストを実行
- `pnpm clean` - ビルド成果物をクリーンアップ

### アプリケーション固有のコマンド:
各アプリケーションには独自のスクリプトセットがあります:
- `build` - アプリケーションをビルド
- `dev` - 開発サーバーを起動
- `lint` - コードをリント
- `start` - 本番サーバーを起動
- `clean` - ビルド成果物をクリーンアップ

## 🏗️ 技術スタック

### フロントエンド:
- **Next.js 15** - Reactフレームワーク
- **TypeScript** - 型安全性
- **Material-UI (MUI)** - UIコンポーネントライブラリ
- **React 18** - UIライブラリ

### バックエンド:
- **Firebase Cloud Functions** - サーバーレス関数
- **Node.js** - ランタイム
- **TypeScript** - 型安全性
- **Firebase Admin SDK** - Firebase管理機能
- **Terraform** - Infrastructure as Code
- **Google Cloud Platform** - クラウドインフラストラクチャ

### モノレポ:
- **Turborepo** - ビルドシステムとタスクランナー
- **pnpm Workspaces** - パッケージ管理

## 🔧 設定

### Turborepo設定 (`turbo.json`)
モノレポは以下で設定されています:
- 依存関係管理を含むビルドパイプライン
- 永続プロセスによる開発モード
- リンティングパイプライン
- テストパイプライン
- クリーンタスク設定

### ワークスペース設定 (`package.json`)
- `apps/*`と`packages/*`用にワークスペースが設定されています
- 共有依存関係はルートレベルで管理
- 個別パッケージ依存関係はアプリケーションごとに管理
- pnpmを使用した効率的なパッケージ管理

## 📱 アプリケーション概要

### フロントエンドアプリ (`apps/frontend/app`)
- AI秘書Botアプリケーション
- LINE風のモバイルUIインターフェース
- チャット機能とタスク実行機能
- Material-UIベースのレスポンシブデザイン

### バックエンド (`apps/backend`)
- Firebase Cloud Functions
- RESTful APIサービス
- 認証と認可
- データ管理とビジネスロジック
- Terraform Infrastructure as Code
- 環境別デプロイメント（staging/production）

## 🚀 デプロイ

### アプリケーションのデプロイ:
```bash
# 本番用ビルド
pnpm build

# 本番サーバーを起動
pnpm start
```

### インフラストラクチャのデプロイ:
```bash
# ステージング環境
cd apps/backend/infra/environments/staging
terraform init
terraform plan
terraform apply

# 本番環境
cd apps/backend/infra/environments/prod
terraform init
terraform plan
terraform apply
```

### Firebase Functionsのデプロイ:
```bash
# バックエンドディレクトリに移動
cd apps/backend/functions

# 関数をビルド
pnpm run build

# Firebaseにデプロイ
pnpm run deploy
```

## 🤝 コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成: `git checkout -b feature/amazing-feature`
3. 変更をコミット: `git commit -m 'Add amazing feature'`
4. ブランチにプッシュ: `git push origin feature/amazing-feature`
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトはMITライセンスの下でライセンスされています。詳細についてはLICENSEファイルを参照してください。

## 🆘 サポート

質問やヘルプが必要な場合:
- GitHubでイシューを開く
- ドキュメントを確認
- 開発チームに連絡

---

