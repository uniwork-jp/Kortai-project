# 環境構成

このドキュメントでは、AI Assistantプロジェクトの各環境の構成について説明します。

## 環境概要

### **STG (Staging)**
開発・QA・実機テスト用の環境

### **PROD (Production)**
本番ユーザー向けの環境

## 環境別構成

### ローカル環境

| コンポーネント | 構成 |
|---------------|------|
| **LIFF** | モック（コードベース） |
| **エンドポイント** | ローカルモックサーバー（FireBaseCLI） |
| **UI** | ローカルサーバー（Next） |

**特徴:**
- 開発時の完全なオフライン環境
- モックデータを使用したテスト
- 高速な開発サイクル

### STG環境

| コンポーネント | 構成 |
|---------------|------|
| **LIFF** | LINE develop（STGアプリ） |
| **エンドポイント** | FireBase（STGアプリ） |
| **UI** | Vercel（STGアプリ） |

**特徴:**
- 実際のLINEプラットフォームとの統合テスト
- Firebase Cloud Functionsを使用したAPI
- 本番環境に近い構成でのテスト

### PROD環境

| コンポーネント | 構成 |
|---------------|------|
| **LIFF** | LINE develop（PRODアプリ） |
| **エンドポイント** | FireBase（PRODアプリ） |
| **UI** | Vercel（PRODアプリ） |

**特徴:**
- 本番ユーザー向けの完全なサービス
- 本番レベルのパフォーマンスとセキュリティ
- 実際のユーザーデータの処理

## 環境間の移行

### ローカル → STG
1. コードをSTGブランチにマージ
2. Firebase STGプロジェクトにデプロイ
3. Vercel STGアプリケーションにデプロイ
4. LINE STGアプリの設定を更新

### STG → PROD
1. STG環境でのテスト完了
2. コードをPRODブランチにマージ
3. Firebase PRODプロジェクトにデプロイ
4. Vercel PRODアプリケーションにデプロイ
5. LINE PRODアプリの設定を更新

## 設定ファイル

各環境の設定は以下のファイルで管理されています：

- **Firebase設定**: `apps/backend/firebase.json`
- **環境変数**: `packages/config/env.ts`
- **Next.js設定**: `apps/frontend/app/next.config.js`

## 注意事項

- 各環境は独立したFirebaseプロジェクトを使用
- LINEアプリは環境ごとに異なるアプリIDを使用
- Vercelのデプロイメントは環境ごとに分離
- 環境間でのデータ共有は行わない
