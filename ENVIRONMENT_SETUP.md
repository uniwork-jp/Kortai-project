# 環境構成ガイド (Next.js + Vercel + Firebase + LINE LIFF)

本ドキュメントは、STG (Staging) 環境と PROD (Production) 環境を適切に分離・運用するためのルールを示します。

---

## 1. 環境の命名規則

* **STG (Staging)**: 開発・QA・実機テスト用の環境
* **PROD (Production)**: 本番ユーザー向けの環境

---

## 2. Next.js (Vercel)

### プロジェクト

* Vercel プロジェクトは 1 つで管理
* 環境を `Preview` (STG) と `Production` (PROD) に分ける

### ブランチ運用

* `develop` → STG (Preview デプロイ)
* `main` → PROD (Production デプロイ)

### 環境変数

* Vercel の Environment Variables を使用

  * **Preview**: STG 用の Firebase/LIFF 設定
  * **Production**: PROD 用の Firebase/LIFF 設定

例:

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx-stg
NEXT_PUBLIC_LIFF_ID=xxxxx-stg
```

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx-prod
NEXT_PUBLIC_LIFF_ID=xxxxx-prod
```

---

## 3. Firebase (Firestore / Functions)

### プロジェクト分割

* Firebase プロジェクトを環境ごとに用意

  * `myapp-stg`
  * `myapp-prod`

### データベース

* Firestore もプロジェクト単位で完全分離
* Functions デプロイ先もプロジェクトごとに分ける

---

## 4. LINE (LIFF / Messaging API)

### チャネル分割

* LINE Developers で環境ごとにチャネルを作成

  * `myapp-stg-li ff`
  * `myapp-prod-liff`

### LIFF ID / Channel ID

* 環境ごとに異なる ID を発行
* `.env` に格納し、Vercel で STG/PROD 切り替え

---

## 5. Monorepo 構成

```
apps/
  web/          # Next.js アプリ (Vercel デプロイ)
packages/
  config/       # 環境変数管理 (Zod バリデーション)
  types/        # 型定義共有
  ui/           # 共通UIコンポーネント
```

### 環境変数管理 (例)

`packages/config/env.ts`

```ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  NEXT_PUBLIC_LIFF_ID: z.string(),
});

export const env = envSchema.parse(process.env);
```

---

## 6. 開発フロー

1. ローカル開発 → `.env.local` を使用
2. PR マージ → `develop` → Vercel Preview (STG)
3. STG 実機テスト (LINE アプリ内)
4. `main` マージ → Vercel Production (PROD)

---

## 7. 命名規則まとめ

* Firebase プロジェクト: `myapp-stg` / `myapp-prod`
* LINE チャネル: `myapp-stg-liff` / `myapp-prod-liff`
* Vercel 環境: Preview = STG / Production = PROD
* GitHub ブランチ: `develop` = STG / `main` = PROD

---
