# IAM Module Variables
variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "ai-assistant"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "create_cloud_function_sa" {
  description = "Whether to create a service account for Cloud Functions"
  type        = bool
  default     = true
}

variable "create_firestore_sa" {
  description = "Whether to create a service account for Firestore"
  type        = bool
  default     = true
}

variable "create_service_account_keys" {
  description = "Whether to create service account keys (for local development)"
  type        = bool
  default     = false
}

variable "cloud_function_sa_roles" {
  description = "List of IAM roles to assign to the Cloud Function service account"
  type        = set(string)
  default = [
    "roles/cloudfunctions.invoker",
    "roles/firebase.admin",
    "roles/firestore.user",
    "roles/storage.objectViewer"
  ]
}

variable "firestore_sa_roles" {
  description = "List of IAM roles to assign to the Firestore service account"
  type        = set(string)
  default = [
    "roles/firestore.user",
    "roles/firebase.admin"
  ]
}

variable "custom_iam_bindings" {
  description = "Map of custom IAM bindings"
  type = map(object({
    role   = string
    member = string
  }))
  default = {}
}
