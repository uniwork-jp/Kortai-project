# Cloud Functions Module
resource "google_cloudfunctions2_function" "function" {
  for_each = var.functions

  project     = var.project_id
  name        = each.value.name
  location    = var.region
  description = each.value.description

  build_config {
    runtime     = each.value.runtime
    entry_point = each.value.entry_point
    source {
      storage_source {
        bucket = google_storage_bucket.function_source.name
        object = google_storage_bucket_object.function_source[each.key].name
      }
    }
  }

  service_config {
    max_instance_count    = each.value.max_instance_count
    min_instance_count    = each.value.min_instance_count
    available_memory      = each.value.available_memory
    timeout_seconds       = each.value.timeout_seconds
    environment_variables = each.value.environment_variables
    ingress_settings      = each.value.ingress_settings
    all_traffic_on_latest_revision = each.value.all_traffic_on_latest_revision

    dynamic "vpc_connector" {
      for_each = each.value.vpc_connector != null ? [each.value.vpc_connector] : []
      content {
        name = vpc_connector.value.name
        egress_setting = vpc_connector.value.egress_setting
      }
    }
  }

  depends_on = [
    google_project_service.cloudfunctions_api,
    google_project_service.cloudbuild_api,
    google_storage_bucket.function_source
  ]
}

# Storage bucket for function source code
resource "google_storage_bucket" "function_source" {
  name     = "${var.project_id}-function-source-${random_string.bucket_suffix.result}"
  location = var.region

  uniform_bucket_level_access = true
  force_destroy = true
}

# Random suffix for bucket name
resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}

# Storage bucket objects for function source code
resource "google_storage_bucket_object" "function_source" {
  for_each = var.functions

  name   = "${each.value.name}-${each.value.source_version}.zip"
  bucket = google_storage_bucket.function_source.name
  source = each.value.source_zip_path
}

# IAM bindings for Cloud Functions
resource "google_cloudfunctions2_function_iam_binding" "function_invoker" {
  for_each = var.functions

  project        = var.project_id
  location       = var.region
  cloud_function = google_cloudfunctions2_function.function[each.key].name
  role           = "roles/cloudfunctions.invoker"
  members        = each.value.invoker_members
}

# Enable required APIs
resource "google_project_service" "cloudfunctions_api" {
  project = var.project_id
  service = "cloudfunctions.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "cloudbuild_api" {
  project = var.project_id
  service = "cloudbuild.googleapis.com"

  disable_on_destroy = false
}

resource "google_project_service" "storage_api" {
  project = var.project_id
  service = "storage.googleapis.com"

  disable_on_destroy = false
}
