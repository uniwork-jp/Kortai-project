# フロントエンドアプリケーション

このディレクトリには、Next.jsで構築され、Firebaseバックエンドサービスとシームレスに連携するように設計されたAI Assistantプロジェクトのすべてのフロントエンドアプリケーションが含まれています。

## 📁 ディレクトリ構造

```
apps/frontend/
├── app/                    # 管理ダッシュボード (ポート 3001)
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── next.config.js
├── dashboard/              # ユーザーダッシュボード (ポート 3002) - 計画中
├── documents/              # フロントエンドドキュメント
└── README.md               # このファイル
```

## 🚀 開発環境

### 1. **ローカル開発環境**
- **目的**: ローカルマシンでの開発とテスト
- **機能**:
  - Next.js開発サーバーによるホットリロード
  - LINE統合テスト用のLIFFモックプロバイダー
  - バックエンドサービス用のFirebaseエミュレーター
  - TypeScriptコンパイルとリンティング
  - デバッグ用のソースマップ

**セットアップ:**
```bash
# 依存関係をインストール
pnpm install

# 開発サーバーを起動
pnpm dev

# アプリケーションにアクセス:
# 管理ダッシュボード: http://localhost:3001
# ユーザーダッシュボード: http://localhost:3002 (計画中)
```

### 2. **ステージング環境**
- **目的**: 本番前のテストとQA
- **機能**:
  - 本番ライクなビルド最適化
  - 実際のFirebaseサービス（ステージングプロジェクト）
  - 実際のLINE LIFF統合
  - パフォーマンス監視
  - エラートラッキングとログ

**デプロイ:**
```bash
# ステージング用にビルド
pnpm build

# ステージングにデプロイ
pnpm deploy:staging
```

### 3. **本番環境**
- **目的**: エンドユーザー向けのライブアプリケーション
- **機能**:
  - 最適化された本番ビルド
  - CDN配信
  - 実際のFirebaseサービス（本番プロジェクト）
  - 実際のLINE LIFF統合
  - アナリティクスと監視
  - セキュリティ強化

**デプロイ:**
```bash
# 本番用にビルド
pnpm build

# 本番にデプロイ
pnpm deploy:production
```

## 🏗️ アプリケーションアーキテクチャ

### **管理ダッシュボード** (`app/`)
- **ポート**: 3001
- **目的**: システム管理用の管理インターフェース
- **機能**:
  - ユーザー管理とアナリティクス
  - システム設定
  - 監視とログ
  - AIモデル管理
  - 会話アナリティクス



## 🛠️ 技術スタック

### **コア技術**
- **Next.js 14** - App Router付きReactフレームワーク
- **React 18** - コンカレント機能付きUIライブラリ
- **TypeScript** - 型安全性とより良い開発者体験
- **Tailwind CSS** - ユーティリティファーストCSSフレームワーク

### **状態管理**
- **React Context** - グローバル状態管理
- **React Query** - サーバー状態管理
- **Zustand** - 軽量状態管理（オプション）

### **認証と統合**
- **Firebase Auth** - ユーザー認証
- **LINE LIFF SDK** - LINE統合
- **LIFF Mock Provider** - ローカル開発用モック

### **開発ツール**
- **ESLint** - コードリンティング
- **Prettier** - コードフォーマット
- **TypeScript** - 型チェック
- **Turborepo** - モノレポビルドシステム

## 🔧 開発ワークフロー

### **開始方法**
```bash
# リポジトリをクローン
git clone <repo-url>
cd AI-Assistant

# 依存関係をインストール
pnpm install

# すべてのフロントエンドアプリケーションを起動
pnpm dev

# または特定のアプリケーションを起動
pnpm dev --filter=@ai-assistant/admin
```

### **環境設定**
各環境は異なる設定を使用します：

```typescript
// ローカル開発
const config = {
  firebase: {
    projectId: 'ai-assistant-dev',
    useEmulator: true
  },
  liff: {
    useMock: true,
    mockUserId: 'dev_user_123'
  }
};

// ステージング
const config = {
  firebase: {
    projectId: 'ai-assistant-staging',
    useEmulator: false
  },
  liff: {
    useMock: false,
    liffId: 'staging-liff-id'
  }
};

// 本番
const config = {
  firebase: {
    projectId: 'ai-assistant-prod',
    useEmulator: false
  },
  liff: {
    useMock: false,
    liffId: 'production-liff-id'
  }
};
```

## 📦 パッケージ管理

### **共有パッケージ**
- `@ai-assistant/config` - 環境設定
- `@ai-assistant/utils` - ユーティリティ関数
- `@ai-assistant/liff-mock` - LIFFモックプロバイダー
- `@ai-assistant/types` - 共有TypeScript型
- `@ai-assistant/api-client` - Zodスキーマ付きAPIクライアント

### **依存関係**
```bash
# 特定のアプリに依存関係を追加
pnpm add react-query --filter=@ai-assistant/admin

# 共有依存関係を追加
pnpm add lodash --filter=@ai-assistant/config

# 開発依存関係を追加
pnpm add -D @types/lodash --filter=@ai-assistant/admin
```

## 🚀 デプロイ

### **ビルドプロセス**
```bash
# すべてのアプリケーションをビルド
pnpm build

# 特定のアプリケーションをビルド
pnpm build --filter=@ai-assistant/admin

# ビルド成果物をクリーンアップ
pnpm clean
```

### **環境変数**
各環境には特定の環境変数が必要です：

```bash
# .env.local (ローカル開発)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-assistant-dev
NEXT_PUBLIC_FIREBASE_USE_EMULATOR=true
NEXT_PUBLIC_LIFF_USE_MOCK=true
NEXT_PUBLIC_LIFF_ID=mock-liff-id

# .env.staging (ステージング)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-assistant-staging
NEXT_PUBLIC_FIREBASE_USE_EMULATOR=false
NEXT_PUBLIC_LIFF_USE_MOCK=false
NEXT_PUBLIC_LIFF_ID=staging-liff-id

# .env.production (本番)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-assistant-prod
NEXT_PUBLIC_FIREBASE_USE_EMULATOR=false
NEXT_PUBLIC_LIFF_USE_MOCK=false
NEXT_PUBLIC_LIFF_ID=production-liff-id
```

## 🧪 テスト

### **テストコマンド**
```bash
# すべてのテストを実行
pnpm test

# 特定のアプリのテストを実行
pnpm test --filter=@ai-assistant/admin

# ウォッチモードでテストを実行
pnpm test:watch

# カバレッジ付きでテストを実行
pnpm test:coverage
```

### **テスト戦略**
- **単体テスト** - コンポーネントとユーティリティのテスト
- **統合テスト** - APIとサービスの統合テスト
- **E2Eテスト** - 完全なユーザージャーニーのテスト
- **ビジュアル回帰テスト** - UI一貫性のテスト

## 📚 ドキュメント

- **[メインREADME](../../README.md)** - プロジェクト概要
- **[環境セットアップ](../../ENVIRONMENT_SETUP.md)** - 開発セットアップガイド
- **[LIFFモックプロバイダー](../../packages/liff-mock/README.md)** - ローカル開発用モック
- **[OpenAPIガイド](../../openapi/TYPES.md)** - API型生成

## 🤝 コントリビューション

1. **機能ブランチを作成**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **開発とテスト**
   ```bash
   pnpm dev
   pnpm test
   pnpm lint
   ```

3. **ビルドと検証**
   ```bash
   pnpm build
   ```

4. **プルリクエストを提出**
   - すべてのテストが通ることを確認
   - 必要に応じてドキュメントを更新
   - コーディング標準に従う

## 🆘 サポート

質問や問題がある場合：
- 既存のドキュメントを確認
- 環境セットアップガイドを確認
- GitHubでイシューを開く
- 開発チームに連絡

---
