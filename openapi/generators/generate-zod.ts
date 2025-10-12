#!/usr/bin/env tsx

/**
 * Zod Generator Script
 * OpenAPI schema.yaml から Zod スキーマを生成するスクリプト
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';
import * as yaml from 'js-yaml';

// 設定
const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = join(__dirname, '../schema.yaml');
const OUTPUT_PATH = join(__dirname, '../../packages/api-types/src/zod/index.ts');

interface OpenAPISchema {
  openapi: string;
  info: any;
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
  };
}

/**
 * OpenAPI スキーマを読み込む
 */
function loadOpenAPISchema(): OpenAPISchema {
  try {
    const fileContent = readFileSync(SCHEMA_PATH, 'utf8');
    return yaml.load(fileContent) as OpenAPISchema;
  } catch (error) {
    console.error('OpenAPI スキーマの読み込みに失敗しました:', error);
    process.exit(1);
    throw error; // TypeScript の要求を満たすため
  }
}

/**
 * OpenAPI 型を Zod スキーマに変換
 */
function convertToZodSchema(schema: any): string {
  if (!schema) return 'z.any()';

  switch (schema.type) {
    case 'string':
      if (schema.enum) {
        return `z.enum([${schema.enum.map((e: string) => `"${e}"`).join(', ')}])`;
      }
      if (schema.format === 'date-time') {
        return 'z.string().datetime()';
      }
      if (schema.format === 'email') {
        return 'z.string().email()';
      }
      return 'z.string()';
    
    case 'integer':
    case 'number':
      return 'z.number()';
    
    case 'boolean':
      return 'z.boolean()';
    
    case 'array':
      const itemSchema = convertToZodSchema(schema.items);
      return `z.array(${itemSchema})`;
    
    case 'object':
      if (schema.properties) {
        const properties = Object.entries(schema.properties)
          .map(([key, value]: [string, any]) => {
            const zodSchema = convertToZodSchema(value);
            const isRequired = schema.required?.includes(key);
            return isRequired ? `${key}: ${zodSchema}` : `${key}: ${zodSchema}.optional()`;
          })
          .join(',\n  ');
        return `z.object({\n  ${properties}\n})`;
      }
      return 'z.record(z.any())';
    
    default:
      return 'z.any()';
  }
}

/**
 * Zod スキーマファイルを生成
 */
function generateZodSchemas(openApiSchema: OpenAPISchema): string {
  const schemas = openApiSchema.components?.schemas || {};
  
  let output = `// 自動生成された Zod スキーマ
// このファイルは OpenAPI スキーマから自動生成されます
// 手動で編集しないでください

import { z } from 'zod';

`;

  // 各スキーマを変換
  Object.entries(schemas).forEach(([name, schema]: [string, any]) => {
    const zodSchema = convertToZodSchema(schema);
    output += `export const ${name}Schema = ${zodSchema};

export type ${name} = z.infer<typeof ${name}Schema>;

`;
  });

  // 共通のレスポンス型
  output += `// 共通の API レスポンス型
export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    count: z.number().optional(),
  });

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
};
`;

  return output;
}

/**
 * メイン実行関数
 */
function main() {
  console.log('🚀 Zod スキーマ生成を開始しています...');
  
  try {
    // OpenAPI スキーマを読み込み
    const openApiSchema = loadOpenAPISchema();
    console.log(`📖 OpenAPI スキーマを読み込みました: ${openApiSchema.info?.title} v${openApiSchema.info?.version}`);
    
    // Zod スキーマを生成
    const zodContent = generateZodSchemas(openApiSchema);
    
    // ファイルに書き込み
    writeFileSync(OUTPUT_PATH, zodContent, 'utf8');
    
    console.log(`✅ Zod スキーマの生成が完了しました: ${OUTPUT_PATH}`);
    console.log(`📊 ${Object.keys(openApiSchema.components?.schemas || {}).length} 個のスキーマを生成しました`);
    
  } catch (error) {
    console.error('❌ Zod スキーマの生成に失敗しました:', error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみ実行
if (require.main === module) {
  main();
}

export { main as generateZodSchemas };
