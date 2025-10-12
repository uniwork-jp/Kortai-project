# Terraform Infrastructure Guide

このディレクトリには、AI AssistantアプリケーションのGCPインフラストラクチャを管理するためのTerraform設定が含まれています。

## 📁 ディレクトリ構造

```
apps/backend/infra/
├── provider.tf                    # GCPプロバイダー設定
├── modules/                       # 再利用可能なモジュール
│   ├── firestore/                # Firestoreデータベースモジュール
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── functions/                # Cloud Functionsモジュール
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── iam/                      # IAMモジュール
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/                  # 環境別設定
│   ├── staging/                  # ステージング環境
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── prod/                     # 本番環境
│       ├── main.tf
│       ├── variables.tf
│       └── terraform.tfvars
└── TERRAFORM_GUIDE.md           # このガイド
```

## 🚀 はじめに

### 前提条件

- Terraform >= 1.0
- Google Cloud SDK
- GCPプロジェクトの設定
- 適切なIAM権限

### インストール

1. Terraformをインストール：
   ```bash
   # Windows (Chocolatey)
   choco install terraform
   
   # macOS (Homebrew)
   brew install terraform
   
   # Linux
   wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
   unzip terraform_1.6.0_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   ```

2. Google Cloud SDKをインストール：
   ```bash
   # Windows
   choco install gcloudsdk
   
   # macOS
   brew install google-cloud-sdk
   
   # Linux
   curl https://sdk.cloud.google.com | bash
   ```

3. 認証を設定：
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

## 🛠️ モジュール

### Firestoreモジュール

Firestoreデータベースとインデックスを管理します。

**主な機能：**
- Firestoreデータベースの作成
- 複合インデックスの設定
- セキュリティルールの適用

**使用例：**
```hcl
module "firestore" {
  source = "../../modules/firestore"

  project_id   = var.project_id
  database_name = "(default)"
  location_id  = var.region

  composite_indexes = {
    users_email = {
      collection = "users"
      fields = [
        {
          field_path = "email"
          order      = "ASCENDING"
        }
      ]
    }
  }
}
```

### Cloud Functionsモジュール

Cloud Functionsのデプロイメントを管理します。

**主な機能：**
- 関数のデプロイメント
- 環境変数の設定
- IAM権限の設定
- スケーリング設定

**使用例：**
```hcl
module "functions" {
  source = "../../modules/functions"

  project_id = var.project_id
  region     = var.region

  functions = {
    api = {
      name        = "api"
      description = "Main API function"
      runtime     = "nodejs18"
      entry_point = "api"
      source_zip_path = "../../../functions/lib/index.js.zip"
      source_version = "1.0.0"
      max_instance_count = 100
      min_instance_count = 2
      available_memory = "2GB"
      timeout_seconds = 300
      environment_variables = {
        NODE_ENV = "production"
      }
      invoker_members = ["allUsers"]
    }
  }
}
```

### IAMモジュール

サービスアカウントとIAM権限を管理します。

**主な機能：**
- サービスアカウントの作成
- IAMロールの割り当て
- サービスアカウントキーの生成（開発用）

**使用例：**
```hcl
module "iam" {
  source = "../../modules/iam"

  project_id   = var.project_id
  app_name     = "ai-assistant"
  environment  = "prod"

  create_cloud_function_sa = true
  create_firestore_sa      = true
  create_service_account_keys = false

  cloud_function_sa_roles = [
    "roles/cloudfunctions.invoker",
    "roles/firebase.admin",
    "roles/firestore.user"
  ]
}
```

## 🌍 環境管理

### ステージング環境 (staging)

- 本番に近い設定
- 中程度のリソース
- テスト用の設定
- 同じFirebaseプロジェクト内の`staging`データベースを使用

### 本番環境 (prod)

- 最大限のリソース
- 高可用性設定
- セキュリティ強化
- 同じFirebaseプロジェクト内の`production`データベースを使用

### Firebase環境設定

両方の環境は同じFirebaseプロジェクトを使用し、異なるFirestoreデータベースで分離されています：

- **Staging**: `staging`データベース
- **Production**: `production`データベース

これにより、同じプロジェクト内で環境を分離しながら、コストを最適化できます。

## 🚀 デプロイメント

### 1. 環境変数の設定

各環境の`terraform.tfvars`ファイルを編集：

```hcl
# terraform.tfvars
project_id = "your-firebase-project-id"
region     = "asia-northeast1"
zone       = "asia-northeast1-a"
environment = "staging"  # or "prod"
app_name   = "ai-assistant"
```

### 2. 初期化

```bash
cd apps/backend/infra/environments/staging
terraform init
```

### 3. 計画の確認

```bash
terraform plan
```

### 4. 適用

```bash
terraform apply
```

### 5. 出力の確認

```bash
terraform output
```

## 🔧 開発ワークフロー

### 新しい環境の追加

1. 新しい環境ディレクトリを作成：
   ```bash
   mkdir apps/backend/infra/environments/new-env
   ```

2. 必要なファイルをコピー：
   ```bash
   cp -r apps/backend/infra/environments/staging/* apps/backend/infra/environments/new-env/
   ```

3. `terraform.tfvars`を編集し、適切なデータベース名を設定

4. デプロイ：
   ```bash
   cd apps/backend/infra/environments/new-env
   terraform init
   terraform plan
   terraform apply
   ```

### モジュールの更新

1. モジュールを更新
2. 各環境で`terraform plan`を実行
3. 変更を確認して`terraform apply`

### リソースの削除

```bash
terraform destroy
```

## 📊 モニタリング

### Terraform状態の確認

```bash
terraform show
terraform state list
terraform state show <resource_name>
```

### ログの確認

```bash
# Cloud Functions ログ
gcloud functions logs read api --region=asia-northeast1

# Firestore ログ
gcloud logging read "resource.type=firestore_database"
```

## 🔒 セキュリティ

### ベストプラクティス

1. **状態ファイルの保護**
   - リモート状態ストレージの使用
   - 状態ファイルの暗号化

2. **IAM権限の最小化**
   - 必要最小限の権限のみ付与
   - 定期的な権限の見直し

3. **シークレット管理**
   - 環境変数での機密情報管理
   - Secret Managerの活用

4. **ネットワークセキュリティ**
   - VPCの設定
   - ファイアウォールルール

### 状態ファイルの管理

```bash
# リモート状態の設定
terraform {
  backend "gcs" {
    bucket = "your-terraform-state-bucket"
    prefix = "ai-assistant/dev"
  }
}
```

## 🐛 トラブルシューティング

### よくある問題

1. **認証エラー**
   ```bash
   gcloud auth application-default login
   ```

2. **権限エラー**
   - 必要なIAMロールの確認
   - プロジェクトの確認

3. **リソースの競合**
   ```bash
   terraform refresh
   terraform plan
   ```

4. **状態ファイルの不整合**
   ```bash
   terraform state rm <resource_name>
   terraform import <resource_name> <resource_id>
   ```

### デバッグ

```bash
# 詳細なログ出力
export TF_LOG=DEBUG
terraform plan

# 特定のリソースのデバッグ
terraform plan -target=module.firestore
```

## 📚 参考資料

- [Terraform公式ドキュメント](https://www.terraform.io/docs)
- [Google Cloud Provider](https://registry.terraform.io/providers/hashicorp/google/latest/docs)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Firestore](https://firebase.google.com/docs/firestore)

## 🤝 コントリビューション

1. フィーチャーブランチを作成
2. 変更を実装
3. `terraform plan`で確認
4. テスト環境で検証
5. プルリクエストを提出

## 📝 ライセンス

このプロジェクトはAI Assistantアプリケーションの一部です。ライセンス情報については、メインプロジェクトのREADMEを参照してください。
