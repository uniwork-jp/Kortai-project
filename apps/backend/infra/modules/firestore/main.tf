# Enable Firestore API
resource "google_project_service" "firestore_api" {
  project = var.project_id
  service = "firestore.googleapis.com"

  disable_on_destroy = false
}

# Firestore Database Module
resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = var.database_name
  location_id = var.location_id
  type        = var.database_type
  concurrency_mode = var.concurrency_mode
  app_engine_integration_mode = var.app_engine_integration_mode

  depends_on = [google_project_service.firestore_api]
}

# Firestore Indexes
resource "google_firestore_index" "composite_indexes" {
  for_each = var.composite_indexes

  project = var.project_id
  database = google_firestore_database.database.name
  collection = each.value.collection

  dynamic "fields" {
    for_each = each.value.fields
    content {
      field_path = fields.value.field_path
      order      = fields.value.order
      array_config = fields.value.array_config
    }
  }
}
