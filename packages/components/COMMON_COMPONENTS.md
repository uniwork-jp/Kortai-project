# @ai-assistant/components

AI Assistant モノレポ用の共有コンポーネントライブラリ。

## 概要

このパッケージには、モノレポ内の異なるアプリケーション間で共有できる再利用可能なReactコンポーネントが含まれています。

## 構造

```
packages/components/
├── src/
│   ├── index.ts          # メインエクスポートファイル
│   └── [components]/     # 個別コンポーネントディレクトリ
├── dist/                 # ビルド出力
├── package.json
├── tsconfig.json
└── README.md
```

## 使用方法

### インストール

これはワークスペースパッケージなので、モノレポ内の他のパッケージから自動的に利用可能です。

### コンポーネントのインポート

```typescript
import { ComponentName } from '@ai-assistant/components';
```

### 開発

```bash
# パッケージをビルド
pnpm build

# 開発用ウォッチモード
pnpm dev

# 型チェック
pnpm type-check

# ビルド出力をクリーンアップ
pnpm clean
```

## 新しいコンポーネントの追加

1. `src/` の下にコンポーネント用の新しいディレクトリを作成
2. 適切なTypeScript型でコンポーネントを実装
3. `src/index.ts` からコンポーネントをエクスポート
4. 必要に応じて `package.json` に依存関係を追加

## ガイドライン

- すべてのコンポーネントはTypeScriptで記述する
- React関数コンポーネントとフックを使用する
- 適切なプロパティ型とインターフェースを含める
- 既存のコードスタイルと規約に従う
- より良いドキュメントのためにJSDocコメントを追加する

## 利用可能なコンポーネント

### BackgroundContainer
モバイルアプリ風の背景コンテナコンポーネント。iPhoneスタイルのスクロールバーとレスポンシブレイアウトを提供します。

```typescript
import { BackgroundContainer } from '@ai-assistant/components';

<BackgroundContainer maxWidth="460px" centered={true}>
  <YourContent />
</BackgroundContainer>
```

**Props:**
- `children`: React.ReactNode - 子コンポーネント
- `maxWidth?: number | string` - 最大幅（デフォルト: '460px'）
- `centered?: boolean` - 中央揃え（デフォルト: true）
- その他のMUI BoxProps

### MobileContainer
BackgroundContainer内で使用するモバイル最適化された内側コンテナコンポーネント。タッチスクロール最適化、モダンなスタイリングを提供します。

```typescript
import { BackgroundContainer, MobileContainer } from '@ai-assistant/components';

<BackgroundContainer>
  <MobileContainer 
    maxWidth="460px"
    borderRadius={12}
    shadow={true}
  >
    <YourContent />
  </MobileContainer>
</BackgroundContainer>
```

**Props:**
- `children`: React.ReactNode - 子コンポーネント
- `maxWidth?: number | string` - 最大幅（デフォルト: '460px'）
- `centered?: boolean` - 中央揃え（デフォルト: true）
- `safeArea?: boolean` - セーフエリア対応（デフォルト: true）
- `backgroundColor?: string` - 背景色（デフォルト: '#f5f5f5'）
- `borderRadius?: number | string` - 角丸（デフォルト: 0）
- `shadow?: boolean` - シャドウ効果（デフォルト: false）
- その他のMUI BoxProps

## 依存関係

- React 18.2.0+
- TypeScript 5.0.0+
- @mui/material 5.15.0+

## ビルド出力

パッケージは以下の内容で `dist/` ディレクトリにビルドされます：
- コンパイルされたJavaScriptファイル
- TypeScript宣言ファイル（`.d.ts`）
- デバッグ用ソースマップ
