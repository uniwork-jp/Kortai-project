# API Types Package

## 概要

このパッケージは OpenAPI スキーマから自動生成された Zod スキーマと TypeScript 型定義を提供します。

## ディレクトリ構造

```
api-types/
├── src/
│   ├── index.ts     # export集約
│   ├── zod/         # 自動生成された Zod スキーマ
│   └── types/       # 自動生成された TypeScript 型
├── dist/            # ビルド出力
├── package.json
├── tsconfig.json
└── API_TYPES.md     # このファイル
```

## 使用方法

### 基本的なインポート

```typescript
import { ApiResponse, ApiError } from '@ai-assistant/api-types';

// 型定義の使用
const response: ApiResponse<User> = {
  success: true,
  data: userData
};
```

### Zod スキーマの使用

```typescript
import { UserSchema, CreateUserSchema } from '@ai-assistant/api-types';

// バリデーション
const user = UserSchema.parse(userData);

// 安全なパース
const result = CreateUserSchema.safeParse(inputData);
if (result.success) {
  // バリデーション成功
  console.log(result.data);
} else {
  // バリデーションエラー
  console.error(result.error);
}
```

### TypeScript 型の使用

```typescript
import type { User, CreateUserRequest, UpdateUserRequest } from '@ai-assistant/api-types';

// 型注釈
function processUser(user: User): void {
  // ユーザー処理
}

function createUser(data: CreateUserRequest): Promise<User> {
  // ユーザー作成
}
```

## 自動生成について

このパッケージの内容は以下のツールによって自動生成されます：

- **OpenAPI スキーマ**: `openapi/schema.yaml`
- **生成ツール**: `openapi/generators/` 内のカスタムスクリプト
- **生成コマンド**: 
  - `pnpm run generate:zod` - Zod スキーマのみ生成
  - `pnpm run generate:types` - TypeScript 型のみ生成
  - `pnpm run generate:api-types` - 両方を生成（推奨）

## 開発時の注意事項

1. **手動編集禁止**: `src/zod/` と `src/types/` 内のファイルは手動で編集しないでください
2. **再生成**: OpenAPI スキーマが更新されたら、必ず型を再生成してください
3. **バージョン管理**: 生成されたファイルは Git で管理します

## 依存関係

- `zod`: ランタイム型バリデーション
- `typescript`: 型定義の生成

## ビルド

```bash
# 型チェック
pnpm run type-check

# ビルド
pnpm run build

# 開発モード（ウォッチ）
pnpm run dev

# クリーン
pnpm run clean
```
