#!/usr/bin/env tsx

/**
 * TypeScript Types Generator Script
 * Generates TypeScript type definitions from OpenAPI schema.yaml
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';

// Configuration
const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = join(__dirname, '../schema.yaml');
const OUTPUT_PATH = join(__dirname, '../../packages/api-types/src/types/index.ts');

interface OpenAPISchema {
  openapi: string;
  info: any;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

/**
 * Load OpenAPI schema
 */
function loadOpenAPISchema(): OpenAPISchema {
  try {
    const fileContent = readFileSync(SCHEMA_PATH, 'utf8');
    return yaml.load(fileContent) as OpenAPISchema;
  } catch (error) {
    console.error('Failed to load OpenAPI schema:', error);
    process.exit(1);
    throw error; // This line will never be reached, but satisfies TypeScript
  }
}

/**
 * Convert OpenAPI type to TypeScript type
 */
function convertToTypeScriptType(schema: any, name?: string): string {
  if (!schema) return 'any';

  // Resolve references
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    return refName || 'any';
  }

  switch (schema.type) {
    case 'string':
      if (schema.enum) {
        return schema.enum.map((e: string) => `"${e}"`).join(' | ');
      }
      return 'string';
    
    case 'integer':
    case 'number':
      return 'number';
    
    case 'boolean':
      return 'boolean';
    
    case 'array':
      const itemType = convertToTypeScriptType(schema.items);
      return `${itemType}[]`;
    
    case 'object':
      if (schema.properties) {
        const properties = Object.entries(schema.properties)
          .map(([key, value]: [string, any]) => {
            const tsType = convertToTypeScriptType(value);
            const isRequired = schema.required?.includes(key);
            return isRequired ? `${key}: ${tsType}` : `${key}?: ${tsType}`;
          })
          .join(';\n  ');
        return `{\n  ${properties}\n}`;
      }
      return 'Record<string, any>';
    
    default:
      return 'any';
  }
}

/**
 * Generate request/response types from API paths
 */
function generateApiTypes(openApiSchema: OpenAPISchema): string {
  const paths = openApiSchema.paths || {};
  let apiTypes = '';

  Object.entries(paths).forEach(([path, methods]: [string, any]) => {
    Object.entries(methods).forEach(([method, operation]: [string, any]) => {
      if (typeof operation === 'object' && operation.operationId) {
        const operationId = operation.operationId;
        
        // Request type
        if (operation.requestBody?.content?.['application/json']?.schema) {
          const requestSchema = operation.requestBody.content['application/json'].schema;
          const requestType = convertToTypeScriptType(requestSchema);
          apiTypes += `export interface ${operationId}Request extends ${requestType} {}

`;
        }

        // Response type
        if (operation.responses?.['200']?.content?.['application/json']?.schema) {
          const responseSchema = operation.responses['200'].content['application/json'].schema;
          const responseType = convertToTypeScriptType(responseSchema);
          
          // Handle array types specially
          if (responseType.includes('[]')) {
            const baseType = responseType.replace('[]', '');
            apiTypes += `export interface ${operationId}Response extends Array<${baseType}> {}

`;
          } else {
            apiTypes += `export interface ${operationId}Response extends ${responseType} {}

`;
          }
        }
      }
    });
  });

  return apiTypes;
}

/**
 * Generate TypeScript type definition file
 */
function generateTypeScriptTypes(openApiSchema: OpenAPISchema): string {
  const schemas = openApiSchema.components?.schemas || {};
  
  let output = `// Auto-generated TypeScript type definitions
// This file is auto-generated from OpenAPI schema
// Do not edit manually

`;

  // Convert each schema
  Object.entries(schemas).forEach(([name, schema]: [string, any]) => {
    const tsType = convertToTypeScriptType(schema, name);
    output += `export interface ${name} ${tsType}

`;
  });

  // Generate types from API paths
  output += generateApiTypes(openApiSchema);

  // Common type definitions
  output += `// Common API type definitions
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// HTTP method type
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API endpoint type
export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  operationId: string;
}
`;

  return output;
}

/**
 * Main execution function
 */
function main() {
  console.log('🚀 Starting TypeScript types generation...');
  
  try {
    // Load OpenAPI schema
    const openApiSchema = loadOpenAPISchema();
    console.log(`📖 Loaded OpenAPI schema: ${openApiSchema.info?.title} v${openApiSchema.info?.version}`);
    
    // Generate TypeScript types
    const typesContent = generateTypeScriptTypes(openApiSchema);
    
    // Write to file
    writeFileSync(OUTPUT_PATH, typesContent, 'utf8');
    
    console.log(`✅ TypeScript types generated successfully: ${OUTPUT_PATH}`);
    console.log(`📊 Generated ${Object.keys(openApiSchema.components?.schemas || {}).length} schema types`);
    
  } catch (error) {
    console.error('❌ Failed to generate TypeScript types:', error);
    process.exit(1);
  }
}

// Execute only when script is run directly
if (require.main === module) {
  main();
}

export { main as generateTypeScriptTypes };
