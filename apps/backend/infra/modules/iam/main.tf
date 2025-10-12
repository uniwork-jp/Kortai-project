# IAM Module
# Service Account for Cloud Functions
resource "google_service_account" "cloud_function_sa" {
  count = var.create_cloud_function_sa ? 1 : 0

  account_id   = "${var.app_name}-cloud-function-sa"
  display_name = "Cloud Function Service Account for ${var.app_name}"
  description  = "Service account for Cloud Functions in ${var.environment} environment"
}

# Service Account for Firestore
resource "google_service_account" "firestore_sa" {
  count = var.create_firestore_sa ? 1 : 0

  account_id   = "${var.app_name}-firestore-sa"
  display_name = "Firestore Service Account for ${var.app_name}"
  description  = "Service account for Firestore operations in ${var.environment} environment"
}

# IAM bindings for Cloud Function Service Account
resource "google_project_iam_member" "cloud_function_sa_roles" {
  for_each = var.create_cloud_function_sa ? var.cloud_function_sa_roles : {}

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.cloud_function_sa[0].email}"
}

# IAM bindings for Firestore Service Account
resource "google_project_iam_member" "firestore_sa_roles" {
  for_each = var.create_firestore_sa ? var.firestore_sa_roles : {}

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.firestore_sa[0].email}"
}

# Custom IAM bindings
resource "google_project_iam_member" "custom_bindings" {
  for_each = var.custom_iam_bindings

  project = var.project_id
  role    = each.value.role
  member  = each.value.member
}

# Service Account Key (for local development)
resource "google_service_account_key" "cloud_function_key" {
  count = var.create_cloud_function_sa && var.create_service_account_keys ? 1 : 0

  service_account_id = google_service_account.cloud_function_sa[0].name
  public_key_type    = "TYPE_X509_PEM_FILE"
}

resource "google_service_account_key" "firestore_key" {
  count = var.create_firestore_sa && var.create_service_account_keys ? 1 : 0

  service_account_id = google_service_account.firestore_sa[0].name
  public_key_type    = "TYPE_X509_PEM_FILE"
}
