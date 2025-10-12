# パッケージスクリプトリファレンス

このドキュメントでは、AI Assistant モノレポで利用可能なすべてのnpm/pnpmスクリプトについて説明します。

---

## 🏗️ **ビルド・開発コマンド**

### コア開発
| コマンド | 説明 | 使用方法 |
|---------|-------------|-------|
| `pnpm dev` | すべてのアプリケーションを開発モードで起動 | `pnpm dev` |
| `pnpm build` | すべてのアプリケーションを本番用にビルド | `pnpm build` |
| `pnpm clean` | すべてのパッケージのビルド成果物をクリーンアップ | `pnpm clean` |

### アプリケーション別開発
| コマンド | 説明 | 使用方法 |
|---------|-------------|-------|
| `pnpm dev:app` | フロントエンドアプリのみを開発モードで起動 | `pnpm dev:app` |
| `pnpm dev:backend` | バックエンドのみを開発モードで起動 | `pnpm dev:backend` |
| `pnpm build:app` | フロントエンドアプリのみをビルド | `pnpm build:app` |
| `pnpm build:backend` | バックエンドのみをビルド | `pnpm build:backend` |

---

## 🧪 **テスト・品質コマンド**

### テスト
| コマンド | 説明 | 使用方法 |
|---------|-------------|-------|
| `pnpm test` | すべてのパッケージのテストを実行 | `pnpm test` |
| `pnpm test:app` | フロントエンドアプリのテストのみを実行 | `pnpm test:app` |
| `pnpm test:backend` | バックエンドのテストのみを実行 | `pnpm test:backend` |

### コード品質
| コマンド | 説明 | 使用方法 |
|---------|-------------|-------|
| `pnpm lint` | すべてのパッケージをリント | `pnpm lint` |
| `pnpm lint:app` | フロントエンドアプリのみをリント | `pnpm lint:app` |
| `pnpm lint:backend` | バックエンドのみをリント | `pnpm lint:backend` |
| `pnpm type-check` | TypeScriptの型チェックを実行 | `pnpm type-check` |

### コードフォーマット
| コマンド | 説明 | 使用方法 |
|---------|-------------|-------|
| `pnpm format` | すべてのパッケージのコードをフォーマット | `pnpm format` |
| `pnpm format:check` | コードが適切にフォーマットされているかチェック | `pnpm format:check` |

---

## 🚀 **デプロイコマンド**

| コマンド | 説明 | 使用方法 |
|---------|-------------|-------|
| `pnpm deploy:staging` | ステージング環境にビルド・デプロイ | `pnpm deploy:staging` |
| `pnpm deploy:production` | 本番環境にビルド・デプロイ | `pnpm deploy:production` |

---

## 🧹 **メンテナンスコマンド**

| コマンド | 説明 | 使用方法 |
|---------|-------------|-------|
| `pnpm clean:all` | すべてのビルド成果物とnode_modulesを削除 | `pnpm clean:all` |
| `pnpm install:clean` | node_modulesを削除して依存関係を再インストール | `pnpm install:clean` |

---

## 📚 **API ドキュメント生成コマンド**

### OpenAPI スキーマから自動生成
| コマンド | 説明 | 使用方法 |
|---------|-------------|-------|
| `pnpm generate:all` | すべてのAPIドキュメントを生成（Zod + TypeScript + HTML） | `pnpm generate:all` |
| `pnpm generate:zod` | Zod スキーマのみを生成 | `pnpm generate:zod` |
| `pnpm generate:types` | TypeScript 型定義のみを生成 | `pnpm generate:types` |
| `pnpm generate:html` | HTML ドキュメントのみを生成 | `pnpm generate:html` |
| `pnpm generate:api-types` | Zod + TypeScript 型を生成 | `pnpm generate:api-types` |

### 生成されるファイル
- **Zod スキーマ**: `packages/api-types/src/zod/index.ts`
- **TypeScript 型**: `packages/api-types/src/types/index.ts`
- **HTML ドキュメント**: `apps/documents/api-documentation.html`

---

## 🔥 **Firebase エミュレータコマンド**

### モックサーバー管理
| コマンド | 説明 | 使用方法 |
|---------|-------------|-------|
| `pnpm mock:start` | Firebaseエミュレータをフォアグラウンドで起動 | `pnpm mock:start` |
| `pnpm mock:start-bg` | Firebaseエミュレータをバックグラウンドで起動 | `pnpm mock:start-bg` |
| `pnpm mock:stop` | 実行中のFirebaseエミュレータを停止 | `pnpm mock:stop` |
| `pnpm mock:status` | Firebaseエミュレータのステータスを確認 | `pnpm mock:status` |
| `pnpm mock:logs` | Firebaseエミュレータのログを表示 | `pnpm mock:logs` |
| `pnpm mock:seed` | Firestoreにモックデータをシード | `pnpm mock:seed` |
| `pnpm mock:ui` | ブラウザでFirebase Emulator UIを開く | `pnpm mock:ui` |

---

## 📋 **コマンドカテゴリ**

### **開発ワークフロー**
```bash
# 開発環境を起動
pnpm dev

# 特定のアプリケーションを起動
pnpm dev:app        # フロントエンドのみ
pnpm dev:backend    # バックエンドのみ

# Firebaseエミュレータを起動
pnpm mock:start-bg  # バックグラウンドモード
pnpm mock:ui        # UIを開く

# API ドキュメントを生成
pnpm generate:all   # すべてのドキュメントを生成
```

### **テストワークフロー**
```bash
# すべてのテストを実行
pnpm test

# 特定のテストを実行
pnpm test:app
pnpm test:backend

# コード品質をチェック
pnpm lint
pnpm type-check
```

### **API ドキュメントワークフロー**
```bash
# OpenAPI スキーマからすべてのドキュメントを生成
pnpm generate:all

# 個別に生成
pnpm generate:zod      # Zod スキーマのみ
pnpm generate:types    # TypeScript 型のみ
pnpm generate:html     # HTML ドキュメントのみ

# 型とスキーマのみ（HTML なし）
pnpm generate:api-types
```

### **ビルド・デプロイワークフロー**
```bash
# 本番用にビルド
pnpm build

# 環境にデプロイ
pnpm deploy:staging
pnpm deploy:production
```

### **メンテナンスワークフロー**
```bash
# すべてをクリーンアップ
pnpm clean:all

# フレッシュインストール
pnpm install:clean

# コードをフォーマット
pnpm format
```

---

## 🔧 **技術詳細**

### **Turborepo統合**
- すべてのビルドコマンドは効率的な並列実行のためにTurborepoを使用
- `--filter=@ai-assistant/package-name`によるパッケージフィルタリング
- 依存関係を考慮したタスク実行

### **Firebase Emulator Suite**
- **Firestore**: `http://localhost:8080`
- **Functions**: `http://localhost:5001`
- **Auth**: `http://localhost:9099`
- **UI**: `http://localhost:4000`

### **パッケージ構造**
- **フロントエンド**: `apps/frontend/app` (LIFFアプリケーション)
- **バックエンド**: `apps/backend` (Firebase Functions)
- **パッケージ**: `packages/*` (共有ユーティリティ)

---

## 💡 **一般的な使用パターン**

### **日常の開発**
```bash
# すべてを起動
pnpm mock:start-bg
pnpm dev

# ステータスを確認
pnpm mock:status

# API ドキュメントを更新
pnpm generate:all
```

### **コミット前**
```bash
pnpm lint
pnpm type-check
pnpm test
pnpm format:check
```

### **フレッシュスタート**
```bash
pnpm clean:all
pnpm install:clean
pnpm dev
```

### **本番ビルド**
```bash
pnpm build
pnpm deploy:production
```

---

## 🆘 **トラブルシューティング**

### **よくある問題**

**ポート競合:**
```bash
pnpm mock:stop
pnpm mock:start
```

**ビルド問題:**
```bash
pnpm clean:all
pnpm install:clean
pnpm build
```

**依存関係の問題:**
```bash
pnpm install:clean
```

**API ドキュメント生成の問題:**
```bash
# 生成スクリプトの依存関係をインストール
cd openapi/generators
pnpm install

# すべてのドキュメントを再生成
pnpm generate:all
```

---

## 📚 **関連ドキュメント**

- **[プロジェクト概要](OVERVIEW.md)** - 完全なプロジェクトアーキテクチャ
- **[環境セットアップ](ENVIRONMENT_SETUP.md)** - 開発環境セットアップ
- **[モックサーバーガイド](scripts/mock-server/MOCK_SERVER.md)** - Firebaseエミュレータの詳細
- **[フロントエンドガイド](apps/frontend/FRONTEND.md)** - フロントエンド開発ガイド

---
