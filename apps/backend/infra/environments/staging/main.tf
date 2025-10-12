# Staging Environment Configuration
terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1"
    }
  }
}

# Configure providers
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Local values
locals {
  environment = "staging"
  app_name    = "ai-assistant"
  common_tags = {
    Environment = local.environment
    Application = local.app_name
    ManagedBy   = "terraform"
  }
}

# IAM Module
module "iam" {
  source = "../../modules/iam"

  project_id   = var.project_id
  app_name     = local.app_name
  environment  = local.environment

  create_cloud_function_sa = true
  create_firestore_sa      = true
  create_service_account_keys = false

  cloud_function_sa_roles = [
    "roles/cloudfunctions.invoker",
    "roles/firebase.admin",
    "roles/firestore.user",
    "roles/storage.objectViewer",
    "roles/logging.logWriter"
  ]

  firestore_sa_roles = [
    "roles/firestore.user",
    "roles/firebase.admin"
  ]
}

# Firestore Module
module "firestore" {
  source = "../../modules/firestore"

  project_id   = var.project_id
  database_name = "staging"
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
    chat_user_timestamp = {
      collection = "chat"
      fields = [
        {
          field_path = "userId"
          order      = "ASCENDING"
        },
        {
          field_path = "timestamp"
          order      = "DESCENDING"
        }
      ]
    }
    ai_responses_model_timestamp = {
      collection = "aiResponses"
      fields = [
        {
          field_path = "model"
          order      = "ASCENDING"
        },
        {
          field_path = "timestamp"
          order      = "DESCENDING"
        }
      ]
    }
  }
}

# Cloud Functions Module
module "functions" {
  source = "../../modules/functions"

  project_id = var.project_id
  region     = var.region

  functions = {
    api = {
      name        = "api"
      description = "Main API function for AI Assistant"
      runtime     = "nodejs18"
      entry_point = "api"
      source_zip_path = "../../../functions/lib/index.js.zip"
      source_version = "1.0.0"
      max_instance_count = 50
      min_instance_count = 1
      available_memory = "1GB"
      timeout_seconds = 300
      environment_variables = {
        NODE_ENV = "staging"
        FIRESTORE_DATABASE = "staging"
      }
      invoker_members = ["allUsers"]
    }
    health_check = {
      name        = "healthCheck"
      description = "Health check function"
      runtime     = "nodejs18"
      entry_point = "healthCheck"
      source_zip_path = "../../../functions/lib/index.js.zip"
      source_version = "1.0.0"
      max_instance_count = 10
      min_instance_count = 1
      available_memory = "256M"
      timeout_seconds = 60
      environment_variables = {
        NODE_ENV = "staging"
      }
      invoker_members = ["allUsers"]
    }
  }
}
