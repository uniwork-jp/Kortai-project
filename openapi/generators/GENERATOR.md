# OpenAPI Generators

OpenAPI スキーマから Zod スキーマ、TypeScript 型定義、HTML ドキュメントを自動生成するスクリプト群です。

## 概要

このディレクトリには以下の生成スクリプトが含まれています：

- `generate-zod.ts` - OpenAPI スキーマから Zod スキーマを生成
- `generate-types.ts` - OpenAPI スキーマから TypeScript 型定義を生成
- `generate-html.ts` - OpenAPI スキーマから HTML ドキュメントを生成

## 使用方法

### 依存関係のインストール

```bash
cd openapi/generators
pnpm install
```

### 生成スクリプトの実行

```bash
# Zod スキーマのみ生成
pnpm run generate:zod

# TypeScript 型定義のみ生成
pnpm run generate:types

# HTML ドキュメントのみ生成
pnpm run generate:html

# すべてを生成
pnpm run generate:all
```

### ウォッチモード

```bash
# Zod スキーマのウォッチモード
pnpm run watch:zod

# TypeScript 型定義のウォッチモード
pnpm run watch:types

# HTML ドキュメントのウォッチモード
pnpm run watch:html
```

### 直接実行

```bash
# tsx を使用して直接実行
npx tsx generate-zod.ts
npx tsx generate-types.ts
npx tsx generate-html.ts
```

## 生成されるファイル

- `../../packages/api-types/src/zod/index.ts` - Zod スキーマ
- `../../packages/api-types/src/types/index.ts` - TypeScript 型定義
- `../../apps/documents/api-documentation.html` - HTML ドキュメント

## 設定

### 入力ファイル
- `../schema.yaml` - OpenAPI スキーマ定義（唯一のソース）

### 出力設定
スクリプト内の以下の定数を変更して出力先をカスタマイズできます：

```typescript
const SCHEMA_PATH = join(__dirname, '../schema.yaml');
const OUTPUT_PATH = join(__dirname, '../../packages/api-types/src/zod/index.ts');
const HTML_OUTPUT_PATH = join(__dirname, '../../apps/documents/api-documentation.html');
```

## 対応している OpenAPI 型

### 基本型
- `string` → `z.string()`
- `integer`, `number` → `z.number()`
- `boolean` → `z.boolean()`
- `array` → `z.array()`

### 特殊な型
- `enum` → `z.enum()`
- `date-time` → `z.string().datetime()`
- `email` → `z.string().email()`
- `object` → `z.object()`

### 参照型
- `$ref` → 参照先のスキーマ名

## HTML ドキュメント機能

### 特徴
- **レスポンシブデザイン**: デスクトップ、タブレット、モバイル対応
- **モダンなUI**: グラデーション、シャドウ、カードレイアウト
- **カラーコード**: HTTP メソッド別の色分け（GET: 緑、POST: 青、PUT: 黄、DELETE: 赤、PATCH: 紫）
- **日本語対応**: すべてのテキストが日本語
- **スキーマ表示**: データスキーマの詳細表示
- **自動更新**: OpenAPI スキーマの変更に自動対応

### HTML 出力内容
- API 情報（タイトル、バージョン、説明）
- 全エンドポイント（メソッド、パス、説明）
- リクエスト/レスポンス情報
- データスキーマ（プロパティタイプ、必須項目）
- 生成日時のフッター

## 開発時の注意事項

1. **手動編集禁止**: 生成されたファイルは手動で編集しないでください
2. **スキーマ更新**: `schema.yaml` を更新したら必ず再生成してください
3. **バージョン管理**: 生成されたファイルも Git で管理します
4. **HTML 表示**: 生成された HTML ファイルはブラウザで開いて確認できます

## トラブルシューティング

### よくあるエラー

1. **スキーマ読み込みエラー**
   ```
   Failed to load OpenAPI schema
   ```
   - `schema.yaml` の構文を確認してください
   - YAML のインデントが正しいか確認してください

2. **出力先エラー**
   ```
   ENOENT: no such file or directory
   ```
   - 出力先ディレクトリが存在するか確認してください
   - `packages/api-types/src/` または `apps/documents/` ディレクトリが作成されているか確認してください

3. **型変換エラー**
   - OpenAPI スキーマの型定義が正しいか確認してください
   - 未対応の型がある場合はスクリプトを拡張してください

4. **HTML 生成エラー**
   - `apps/documents/` ディレクトリが存在するか確認してください
   - ファイル書き込み権限があるか確認してください

## 拡張

新しい型や機能を追加する場合は、以下の関数を修正してください：

- `convertToZodSchema()` - Zod スキーマ変換ロジック
- `convertToTypeScriptType()` - TypeScript 型変換ロジック
- `generateHTMLDocumentation()` - HTML ドキュメント生成ロジック

## プロジェクトルートからの実行

プロジェクトルートから以下のコマンドで実行できます：

```bash
# Zod スキーマのみ生成
pnpm run generate:zod

# TypeScript 型定義のみ生成
pnpm run generate:types

# HTML ドキュメントのみ生成
pnpm run generate:html

# すべてを生成（推奨）
pnpm run generate:api-types
```
