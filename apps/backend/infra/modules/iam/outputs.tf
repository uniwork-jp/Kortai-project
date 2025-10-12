# IAM Module Outputs
output "cloud_function_service_account_email" {
  description = "Email of the Cloud Function service account"
  value       = var.create_cloud_function_sa ? google_service_account.cloud_function_sa[0].email : null
}

output "firestore_service_account_email" {
  description = "Email of the Firestore service account"
  value       = var.create_firestore_sa ? google_service_account.firestore_sa[0].email : null
}

output "cloud_function_service_account_id" {
  description = "ID of the Cloud Function service account"
  value       = var.create_cloud_function_sa ? google_service_account.cloud_function_sa[0].id : null
}

output "firestore_service_account_id" {
  description = "ID of the Firestore service account"
  value       = var.create_firestore_sa ? google_service_account.firestore_sa[0].id : null
}

output "cloud_function_service_account_key" {
  description = "Service account key for Cloud Function (base64 encoded)"
  value       = var.create_cloud_function_sa && var.create_service_account_keys ? google_service_account_key.cloud_function_key[0].private_key : null
  sensitive   = true
}

output "firestore_service_account_key" {
  description = "Service account key for Firestore (base64 encoded)"
  value       = var.create_firestore_sa && var.create_service_account_keys ? google_service_account_key.firestore_key[0].private_key : null
  sensitive   = true
}
