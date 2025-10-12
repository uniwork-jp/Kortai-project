# Cloud Functions Module Variables
variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "asia-northeast1"
}

variable "functions" {
  description = "Map of Cloud Functions to deploy"
  type = map(object({
    name        = string
    description = string
    runtime     = string
    entry_point = string
    source_zip_path = string
    source_version = string
    max_instance_count = optional(number, 100)
    min_instance_count = optional(number, 0)
    available_memory = optional(string, "256M")
    timeout_seconds = optional(number, 60)
    environment_variables = optional(map(string), {})
    ingress_settings = optional(string, "ALLOW_ALL")
    all_traffic_on_latest_revision = optional(bool, true)
    invoker_members = optional(list(string), ["allUsers"])
    vpc_connector = optional(object({
      name = string
      egress_setting = string
    }), null)
  }))
  default = {}
}
