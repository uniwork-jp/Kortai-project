# Cloud Functions Module Outputs
output "function_urls" {
  description = "URLs of the deployed Cloud Functions"
  value = {
    for k, v in google_cloudfunctions2_function.function : k => v.service_config[0].uri
  }
}

output "function_names" {
  description = "Names of the deployed Cloud Functions"
  value = {
    for k, v in google_cloudfunctions2_function.function : k => v.name
  }
}

output "source_bucket_name" {
  description = "Name of the source code storage bucket"
  value       = google_storage_bucket.function_source.name
}
