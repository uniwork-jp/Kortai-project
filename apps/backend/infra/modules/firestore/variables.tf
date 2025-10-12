# Firestore Module Variables
variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "database_name" {
  description = "The name of the Firestore database"
  type        = string
}

variable "location_id" {
  description = "The location of the Firestore database"
  type        = string
  default     = "asia-northeast1"
}

variable "database_type" {
  description = "The type of the Firestore database"
  type        = string
  default     = "FIRESTORE_NATIVE"
}

variable "concurrency_mode" {
  description = "The concurrency mode of the Firestore database"
  type        = string
  default     = "OPTIMISTIC"
}

variable "app_engine_integration_mode" {
  description = "The App Engine integration mode"
  type        = string
  default     = "DISABLED"
}

variable "security_rules_file" {
  description = "Path to Firestore security rules file"
  type        = string
  default     = null
}

variable "composite_indexes" {
  description = "Map of composite indexes to create"
  type = map(object({
    collection = string
    fields = list(object({
      field_path   = string
      order        = optional(string)
      array_config = optional(string)
    }))
  }))
  default = {}
}
