# バックエンド関数ソースディレクトリ構造

このドキュメントは、バックエンド関数のソースコードの組織と構造について説明します。

## 📁 ディレクトリ概要

```
src/
├── api/                    # APIエンドポイントとルートハンドラー
│   ├── calendar/          # カレンダー関連APIエンドポイント
│   │   ├── index.ts       # カレンダーAPIエンドポイント（Cloud Function）
│   │   ├── NaturalLanguageHandler.ts
│   │   ├── EventValidator.ts
│   │   ├── CalendarService.ts
│   │   └── CALENDER_CLASS_DIAGRAM.md
│   └── gmail/             # Gmail関連APIエンドポイント
│       ├── index.ts       # Gmail APIエンドポイント（Cloud Function）
│       └── GMAIL_DIAGRAM.md
├── services/              # ビジネスロジックとサービス層
│   ├── NaturalLanguageHandler.ts
│   ├── GPTService.ts
│   ├── EventValidator.ts
│   ├── CalendarService.ts
│   └── AuthService.ts
├── utils/                 # ユーティリティ関数と共有コード
│   └── types.ts          # TypeScript型定義
├── index.ts              # メインCloud Functionsエントリーポイント
└── test-chat.ts          # テストチャット機能
```

## 🎯 ディレクトリの目的

### `/api` - APIエンドポイント
**目的**: 外部リクエストのエントリーポイントとして機能するCloud Functions HTTPエンドポイントを含む。

- **`calendar/`**: カレンダー関連APIエンドポイント
  - `index.ts`: CRUD操作を含むメインカレンダーAPIエンドポイント
  - カレンダー機能のサービスクラス
  - クラス図ドキュメント

- **`gmail/`**: Gmail関連APIエンドポイント
  - `index.ts`: メール操作を含むメインGmail APIエンドポイント
  - Gmail統合ドキュメント

### `/services` - ビジネスロジック層
**目的**: メイン機能を処理するコアビジネスロジックとサービスクラスを含む。

- **`NaturalLanguageHandler.ts`**: 自然言語リクエストを処理するメインオーケストレーター
- **`GPTService.ts`**: 自然言語処理のためのGPT API統合
- **`EventValidator.ts`**: データ検証と正規化
- **`CalendarService.ts`**: Google Calendar APIラッパー
- **`AuthService.ts`**: 認証と認可サービス

### `/utils` - ユーティリティ関数
**目的**: 共有ユーティリティ、型定義、ヘルパー関数を含む。

- **`types.ts`**: システム全体のTypeScriptインターフェースと型定義

## 🔄 データフロー

```
外部リクエスト → /api/*/index.ts → /services/* → /utils/types
```

1. **API層**: HTTPリクエストを受信し、適切なサービスにルーティング
2. **サービス層**: ビジネスロジックを処理し、異なるサービス間の調整
3. **ユーティリティ層**: 共有型とユーティリティを提供

## 🏗️ アーキテクチャパターン

### サービス指向アーキテクチャ
- 各サービスは単一の責任を持つ
- サービスは疎結合で独立してテスト可能
- API、ビジネスロジック、ユーティリティの明確な分離

### 依存性注入
- サービスは必要に応じてインスタンス化され注入される
- テスタビリティとモジュール性を促進

### 型安全性
- `/utils/types.ts`の包括的なTypeScriptインターフェース
- すべてのサービスが強く型付けされたインターフェースを使用
- 適切な場合のランタイム検証

## 📋 主要コンポーネント

### NaturalLanguageHandler
- **場所**: `/services/NaturalLanguageHandler.ts`
- **目的**: 自然言語カレンダーリクエストを処理するメインエントリーポイント
- **主要メソッド**:
  - `handleRequest()`: 自然言語入力を処理
  - `handleUpdateRequest()`: 既存イベントを更新
  - `handleDeleteRequest()`: イベントを削除

### GPTService
- **場所**: `/services/GPTService.ts`
- **目的**: 自然言語から構造化データへの変換のためのGPT API統合
- **主要メソッド**:
  - `parseToEvent()`: 自然言語をEventJSONに変換
  - `buildPromptTemplate()`: GPTプロンプトを作成

### EventValidator
- **場所**: `/services/EventValidator.ts`
- **目的**: データ検証と正規化
- **主要メソッド**:
  - `validate()`: イベントデータ構造を検証
  - `normalizeDates()`: 相対日付を絶対日付に変換

### CalendarService
- **場所**: `/services/CalendarService.ts`
- **目的**: Google Calendar APIラッパー
- **主要メソッド**:
  - `createEvent()`: カレンダーイベントを作成
  - `updateEvent()`: 既存イベントを更新
  - `deleteEvent()`: イベントを削除
  - `getEvents()`: イベントを取得

### AuthService
- **場所**: `/services/AuthService.ts`
- **目的**: 認証と認可
- **主要メソッド**:
  - `getGoogleAccessToken()`: ユーザーアクセストークンを取得
  - `verifyUserAuthentication()`: ユーザー認証ステータスを検証
  - `refreshAccessToken()`: 期限切れトークンを更新

## 🔧 開発ガイドライン

### 新しいサービスの追加
1. `/services/`にサービスクラスを作成
2. `/utils/types.ts`に対応する型を追加
3. このドキュメントを更新

### 新しいAPIエンドポイントの追加
1. `/api/`に新しいディレクトリを作成
2. Cloud Functionエンドポイントで`index.ts`を追加
3. `/services/`からサービスをインポートして使用
4. このドキュメントを更新

### 型定義
- すべての新しい型は`/utils/types.ts`に追加する
- 説明的なインターフェース名を使用
- 複雑な型にはJSDocコメントを含める

## 🚀 デプロイメント

ソースコードは`/lib/`ディレクトリでJavaScriptにコンパイルされ、Google Cloud Functionsとしてデプロイされます。`/api/`ディレクトリの各`index.ts`ファイルは、別々のCloud Functionエンドポイントになります。

## 📚 関連ドキュメント

- `CLOUD_FUNCTIONS.md`: Cloud Functionsデプロイメントガイド
- `CALENDER_CLASS_DIAGRAM.md`: カレンダーシステムアーキテクチャ
- `GMAIL_DIAGRAM.md`: Gmail統合アーキテクチャ
