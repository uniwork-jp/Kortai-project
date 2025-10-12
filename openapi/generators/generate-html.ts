#!/usr/bin/env tsx

/**
 * HTML Documentation Generator Script
 * OpenAPI schema.yaml から HTML ドキュメントを生成するスクリプト
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';

// 設定
const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = join(__dirname, '../schema.yaml');
const OUTPUT_DIR = join(__dirname, '../../apps/documents');
const OUTPUT_PATH = join(OUTPUT_DIR, 'api-documentation.html');

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
 * HTML ドキュメントを生成
 */
function generateHTMLDocumentation(openApiSchema: OpenAPISchema): string {
  const { info, paths, components } = openApiSchema;
  
  let html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${info.title} - API Documentation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 0;
            margin-bottom: 30px;
            border-radius: 10px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .info-card {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .info-item {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .info-item h3 {
            color: #667eea;
            margin-bottom: 10px;
        }
        
        .endpoints-section {
            margin-bottom: 30px;
        }
        
        .endpoints-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            cursor: pointer;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
            transition: border-width 0.2s ease;
        }
        
        .endpoints-header.collapsed {
            border-bottom: 3px solid #e0e0e0;
        }
        
        .endpoints-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .endpoints-toggle {
            color: #666;
            font-size: 0.9rem;
            transition: transform 0.2s ease;
            transform: rotate(180deg);
        }
        
        .endpoints-toggle.collapsed {
            transform: rotate(0deg);
        }
        
        .endpoints-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .endpoints-list.collapsed {
            display: none;
        }
        
        .endpoint {
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .endpoint:hover {
            background: #e9ecef;
        }
        
        .endpoint.get {
            border: 1px solid #61affe;
            background: #f0f7ff;
        }
        
        .endpoint.post {
            border: 1px solid #49cc90;
            background: #f0fdf4;
        }
        
        .endpoint.put {
            border: 1px solid #fca130;
            background: #fff7ed;
        }
        
        .endpoint.delete {
            border: 1px solid #f93e3e;
            background: #fef2f2;
        }
        
        .endpoint.patch {
            border: 1px solid #50e3c2;
            background: #f0fdfa;
        }
        
        .method-button {
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.8rem;
            color: white;
            min-width: 50px;
            text-align: center;
            text-transform: uppercase;
        }
        
        .method-button.get { background: #61affe; }
        .method-button.post { background: #49cc90; }
        .method-button.put { background: #fca130; }
        .method-button.delete { background: #f93e3e; }
        .method-button.patch { background: #50e3c2; }
        
        .endpoint-path {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            color: #333;
            flex: 1;
        }
        
        .endpoint-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .action-icon {
            width: 16px;
            height: 16px;
            color: #666;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .action-icon:hover {
            color: #333;
        }
        
        .endpoint-chevron {
            width: 16px;
            height: 16px;
            color: #666;
            cursor: pointer;
            transition: transform 0.2s ease;
            transform: rotate(0deg);
        }
        
        .endpoint-chevron.expanded {
            transform: rotate(180deg);
        }
        
        .endpoint-details {
            margin-top: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 6px;
            display: none;
        }
        
        .endpoint-details.expanded {
            display: block;
        }
        
        .endpoint-description {
            margin-bottom: 15px;
            color: #666;
            font-size: 0.9rem;
        }
        
        /* Parameters Section */
        .parameters-section {
            margin: 20px 0;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0 0 10px 0;
        }
        
        .section-underline {
            height: 2px;
            background: #36c27e;
            width: 30%;
            margin-bottom: 15px;
        }
        
        .parameters-content {
            background: white;
            padding: 15px;
            border-radius: 4px;
        }
        
        .parameter-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 10px;
            padding: 8px 0;
        }
        
        .parameter-name {
            font-weight: 600;
            color: #333;
            min-width: 120px;
        }
        
        .parameter-type {
            color: #8b5cf6;
            font-size: 14px;
            min-width: 80px;
        }
        
        .parameter-required {
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: 500;
        }
        
        .parameter-required.required {
            background: #dc3545;
            color: white;
        }
        
        .parameter-required.optional {
            background: #6c757d;
            color: white;
        }
        
        .parameter-description {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
        }
        
        .no-parameters {
            color: #666;
            font-style: italic;
        }
        
        /* Request Body Section */
        .request-body-section {
            margin: 20px 0;
        }
        
        .request-body-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 10px;
        }
        
        .required-label {
            background: #dc3545;
            color: white;
            font-size: 12px;
            padding: 2px 6px;
            border-radius: 3px;
            font-weight: 500;
        }
        
        .content-type-dropdown select {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 4px 8px;
            font-size: 14px;
            background: white;
        }
        
        .request-body-description {
            color: #666;
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        .request-body-tabs {
            display: flex;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .tab {
            padding: 8px 16px;
            background: white;
            border: 1px solid #e0e0e0;
            border-bottom: none;
            cursor: pointer;
            font-size: 14px;
        }
        
        .tab.active {
            background: #f0f0f0;
            font-weight: 500;
        }
        
        .tab:first-child {
            border-radius: 4px 0 0 0;
        }
        
        .tab:last-child {
            border-radius: 0 4px 0 0;
        }
        
        .example-value-content {
            margin-top: 0;
        }
        
        .code-block {
            background: #282c34;
            border-radius: 6px;
            padding: 0;
            margin: 0;
            overflow: hidden;
            height: 300px;
            border: 1px solid #3c4043;
        }
        
        .code-block pre {
            margin: 0;
            padding: 16px;
            background: transparent;
            overflow-y: auto;
            overflow-x: auto;
            height: 100%;
            box-sizing: border-box;
        }
        
        .code-block code {
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
            font-size: 13px;
            line-height: 1.4;
            color: #d4d4d4;
            background: transparent;
            white-space: pre;
            font-weight: 400;
        }
        
        /* Response Section */
        .response-section {
            margin: 20px 0;
        }
        
        .response-item {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 10px;
            padding: 8px 0;
        }
        
        .status-code {
            font-weight: 600;
            color: #333;
            min-width: 60px;
        }
        
        .response-description {
            color: #666;
            font-size: 14px;
        }
        
        .schema-section {
            margin-top: 30px;
            margin-bottom: 30px;
        }
        
        .schema-section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
            cursor: pointer;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
            transition: border-width 0.2s ease;
        }
        
        .schema-section-header.collapsed {
            border-bottom: 3px solid #e0e0e0;
        }
        
        .schema-section-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .schema-section-toggle {
            color: #666;
            font-size: 0.9rem;
            transition: transform 0.2s ease;
            transform: rotate(180deg);
        }
        
        .schema-section-toggle.collapsed {
            transform: rotate(0deg);
        }
        
        .schemas-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .schemas-list.collapsed {
            display: none;
        }
        
        .schema-container {
            background: #f5f5f5;
            border-radius: 6px;
            border: 1px solid #e0e0e0;
            padding: 12px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: all 0.2s ease;
            cursor: pointer;
        }
        
        .schema-container:hover {
            background: #e9ecef;
        }
        
        .schema-header {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .schema-header.expanded::after {
            content: ' {';
            color: #333;
            font-weight: bold;
        }
        
        .schema-title {
            font-weight: bold;
            font-size: 1rem;
            color: #333;
        }
        
        .schema-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .schema-chevron {
            width: 16px;
            height: 16px;
            color: #666;
            cursor: pointer;
            transition: transform 0.2s ease;
            transform: rotate(0deg);
        }
        
        .schema-chevron.expanded {
            transform: rotate(180deg);
        }
        
        .schema-content {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.4;
            padding: 0;
            margin: 0;
        }
        
        .schema-content.collapsed {
            display: none;
        }
        
        .schema-object {
            margin-left: 0;
        }
        
        .schema-field {
            margin-bottom: 3px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding-left: 20px;
        }
        
        .field-name {
            font-weight: normal;
            color: #333;
            min-width: 180px;
            flex-shrink: 0;
        }
        
        .field-name.required::after {
            content: '*';
            color: #dc3545;
            margin-left: 0;
        }
        
        .field-type {
            color: #8b5cf6;
            font-weight: normal;
            min-width: 80px;
            flex-shrink: 0;
        }
        
        .field-description {
            color: #666;
            font-style: italic;
            font-size: 0.85rem;
            margin-left: 10px;
        }
        
        .nested-object {
            margin-left: 0;
            padding-left: 20px;
        }
        
        .object-brace {
            color: #333;
            font-weight: bold;
            margin-left: 0;
        }
        
        .schema-header-line {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 10px;
        }
        
        .schema-name {
            font-weight: bold;
            color: #333;
        }
        
        .schema-chevron-small {
            width: 12px;
            height: 12px;
            color: #666;
        }
        
        .code-block {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 20px;
            color: #666;
            border-top: 1px solid #e9ecef;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${info.title}</h1>
            <p>${info.description}</p>
            <p>Version ${info.version}</p>
        </div>
        
        <div class="info-card">
            <h2>API 情報</h2>
            <div class="info-grid">
                <div class="info-item">
                    <h3>バージョン</h3>
                    <p>${info.version}</p>
                </div>
                <div class="info-item">
                    <h3>OpenAPI バージョン</h3>
                    <p>${openApiSchema.openapi}</p>
                </div>
                <div class="info-item">
                    <h3>連絡先</h3>
                    <p>${info.contact?.name || 'N/A'}</p>
                </div>
            </div>
        </div>
        
        <div class="endpoints-section">
            <div class="endpoints-header" onclick="toggleEndpoints()">
                <div class="endpoints-title">
                    <span>default</span>
                </div>
                <div class="endpoints-toggle" id="endpoints-toggle">▼</div>
            </div>
            <div class="endpoints-list" id="endpoints-list">`;

  // エンドポイントを生成
  Object.entries(paths).forEach(([path, methods]: [string, any]) => {
    Object.entries(methods).forEach(([method, operation]: [string, any]) => {
      if (typeof operation === 'object' && operation.operationId) {
        const methodClass = method.toLowerCase();
        const endpointId = `${methodClass}-${path.replace(/[^a-zA-Z0-9]/g, '-')}`;
        
        html += `
                <div class="endpoint ${methodClass}" onclick="toggleEndpointDetails('${endpointId}')">
                    <div class="method-button ${methodClass}">${method.toUpperCase()}</div>
                    <div class="endpoint-path">${path}</div>
                    <div class="endpoint-actions">
                        <svg class="endpoint-chevron" id="chevron-${endpointId}" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                        </svg>
                    </div>
                </div>
                <div class="endpoint-details" id="details-${endpointId}">
                    <div class="endpoint-description">
                        ${operation.description || '説明なし'}
                    </div>
                    
                    <!-- Parameters Section -->
                    <div class="parameters-section">
                        <h4 class="section-title">Parameters</h4>
                        <div class="section-underline"></div>
                        <div class="parameters-content">
                            ${operation.parameters && operation.parameters.length > 0 
                                ? operation.parameters.map((param: any) => `
                                    <div class="parameter-item">
                                        <span class="parameter-name">${param.name}</span>
                                        <span class="parameter-type">${param.schema?.type || 'string'}</span>
                                        <span class="parameter-required ${param.required ? 'required' : 'optional'}">${param.required ? 'required' : 'optional'}</span>
                                        ${param.description ? `<div class="parameter-description">${param.description}</div>` : ''}
                                    </div>
                                `).join('')
                                : '<div class="no-parameters">No parameters</div>'
                            }
                        </div>
                    </div>
                    
                    <!-- Request Body Section -->
                    ${operation.requestBody?.content?.['application/json']?.schema ? `
                    <div class="request-body-section">
                        <div class="request-body-header">
                            <h4 class="section-title">Request body</h4>
                            <span class="required-label">required</span>
                            <div class="content-type-dropdown">
                                <select>
                                    <option value="application/json" selected>application/json</option>
                                </select>
                            </div>
                        </div>
                        <div class="request-body-description">
                            ${operation.requestBody.description || 'Request body for this endpoint'}
                        </div>
                        <div class="request-body-tabs">
                            <div class="tab active">Example Value</div>
                            <div class="tab">Schema</div>
                        </div>
                        <div class="example-value-content">
                            <div class="code-block">
                                <pre><code>{
  "municipio_o_alcaldia": "Tlalpan",
  "entidad_federativa": "CDMX",
  "fotos": ["ABC123"],
  "formato_fotos": "jpg",
  "huellas": {
    "rone": "dW5hIGh1ZWxsYQ==",
    "rtwo": "dW5hIGh1ZWxsYQ==",
    "rthree": "dW5hIGh1ZWxsYQ==",
    "rfour": "dW5hIGh1ZWxsYQ==",
    "rfive": "dW5hIGh1ZWxsYQ==",
    "lone": "dW5hIGh1ZWxsYQ==",
    "1two": "dW5hIGh1ZWxsYQ==",
    "1three": "dW5hIGh1ZWxsYQ==",
    "1four": "dW5hIGh1ZWxsYQ==",
    "1five": "dW5hIGh1ZWxsYQ==",
    "rpalm": "dW5hIGh1ZWxsYQ==",
    "1palm": "dW5hIGh1ZWxsYQ=="
  },
  "formato_huellas": "wsq"
}</code></pre>
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    
                    <!-- Response Section -->
                    ${operation.responses ? `
                    <div class="response-section">
                        <h4 class="section-title">Response</h4>
                        <div class="section-underline"></div>
                        ${Object.entries(operation.responses).map(([statusCode, response]: [string, any]) => `
                            <div class="response-item">
                                <span class="status-code">${statusCode}</span>
                                <span class="response-description">${response.description || 'No description'}</span>
                            </div>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>`;
      }
    });
  });

  // スキーマセクション
  if (components?.schemas) {
    html += `
        </div>
        
        <div class="schema-section">
            <div class="schema-section-header" onclick="toggleSchemasSection()">
                <div class="schema-section-title">
                    <span>Schemas</span>
                </div>
                <div class="schema-section-toggle" id="schemas-section-toggle">▼</div>
            </div>
            <div class="schemas-list" id="schemas-list">`;

    Object.entries(components.schemas).forEach(([name, schema]: [string, any]) => {
      html += `
                <div class="schema-container" onclick="toggleSchema('${name}')">
                    <div class="schema-header">
                        <div class="schema-title">${name}</div>
                        <div class="schema-actions">
                            <svg class="schema-chevron" id="chevron-${name}" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                            </svg>
                        </div>
                    </div>
                    <div class="schema-content collapsed" id="content-${name}">
                        <div class="schema-object">`;

      if (schema.properties) {
        Object.entries(schema.properties).forEach(([propName, propSchema]: [string, any]) => {
          const isRequired = schema.required?.includes(propName);
          const fieldType = propSchema.type || 'any';
          const format = propSchema.format ? `(${propSchema.format})` : '';
          
          // Handle nested objects
          if (propSchema.type === 'object' && propSchema.properties) {
            html += `
                            <div class="schema-field">
                                <span class="field-name ${isRequired ? 'required' : ''}">${propName} <span class="object-brace">{</span></span>
                                <span class="field-type">object</span>
                                ${propSchema.description ? `<span class="field-description">${propSchema.description}</span>` : ''}
                            </div>
                            <div class="nested-object">`;
            Object.entries(propSchema.properties).forEach(([nestedPropName, nestedPropSchema]: [string, any]) => {
              const nestedRequired = propSchema.required?.includes(nestedPropName);
              const nestedType = nestedPropSchema.type || 'any';
              const nestedFormat = nestedPropSchema.format ? `(${nestedPropSchema.format})` : '';
              
              html += `
                                <div class="schema-field">
                                    <span class="field-name ${nestedRequired ? 'required' : ''}">${nestedPropName}</span>
                                    <span class="field-type">${nestedType}${nestedFormat}</span>
                                    ${nestedPropSchema.description ? `<span class="field-description">${nestedPropSchema.description}</span>` : ''}
                                </div>`;
            });
            html += `
                                <div class="object-brace">}</div>
                            </div>`;
          } else {
            // Handle regular fields (non-object types)
            html += `
                            <div class="schema-field">
                                <span class="field-name ${isRequired ? 'required' : ''}">${propName}</span>
                                <span class="field-type">${fieldType}${format}</span>
                                ${propSchema.description ? `<span class="field-description">${propSchema.description}</span>` : ''}
                            </div>`;
          }
        });
      }

      html += `
                        </div>
                        <div class="object-brace">}</div>
                    </div>
                </div>`;
    });

    html += `
            </div>
        </div>`;
  }

  html += `
        
        <div class="footer">
            <p>Generated on ${new Date().toLocaleString('ja-JP')}</p>
            <p>AI Assistant API Documentation</p>
        </div>
    </div>
    
    <script>
        function toggleSchemasSection() {
            const list = document.getElementById('schemas-list');
            const toggle = document.getElementById('schemas-section-toggle');
            const header = document.querySelector('.schema-section-header');
            
            if (list.classList.contains('collapsed')) {
                list.classList.remove('collapsed');
                toggle.classList.remove('collapsed');
                header.classList.remove('collapsed');
            } else {
                list.classList.add('collapsed');
                toggle.classList.add('collapsed');
                header.classList.add('collapsed');
            }
        }
        
        function toggleSchema(schemaName) {
            const content = document.getElementById('content-' + schemaName);
            const chevron = document.getElementById('chevron-' + schemaName);
            const header = content.parentElement.querySelector('.schema-header');
            
            if (content.classList.contains('collapsed')) {
                content.classList.remove('collapsed');
                chevron.classList.add('expanded');
                header.classList.add('expanded');
            } else {
                content.classList.add('collapsed');
                chevron.classList.remove('expanded');
                header.classList.remove('expanded');
            }
        }
        
        function toggleEndpoints() {
            const list = document.getElementById('endpoints-list');
            const toggle = document.getElementById('endpoints-toggle');
            const header = document.querySelector('.endpoints-header');
            
            if (list.classList.contains('collapsed')) {
                list.classList.remove('collapsed');
                toggle.classList.remove('collapsed');
                header.classList.remove('collapsed');
            } else {
                list.classList.add('collapsed');
                toggle.classList.add('collapsed');
                header.classList.add('collapsed');
            }
        }
        
        function toggleEndpointDetails(endpointId) {
            const details = document.getElementById('details-' + endpointId);
            const chevron = document.getElementById('chevron-' + endpointId);
            
            if (details.classList.contains('expanded')) {
                details.classList.remove('expanded');
                chevron.classList.remove('expanded');
            } else {
                details.classList.add('expanded');
                chevron.classList.add('expanded');
            }
        }
        
        // Initialize sections with default states
        document.addEventListener('DOMContentLoaded', function() {
            // Schemas section starts expanded (like endpoints)
            const schemasList = document.getElementById('schemas-list');
            if (schemasList) {
                schemasList.classList.remove('collapsed');
            }
            
            // Individual schema contents start collapsed
            const schemaContents = document.querySelectorAll('.schema-content');
            schemaContents.forEach(content => {
                content.classList.add('collapsed');
            });
            
            // Endpoints section starts expanded
            const endpointsList = document.getElementById('endpoints-list');
            if (endpointsList) {
                endpointsList.classList.remove('collapsed');
            }
        });
    </script>
</body>
</html>`;

  return html;
}

/**
 * メイン実行関数
 */
function main() {
  console.log('🚀 HTML ドキュメント生成を開始しています...');
  
  try {
    // 出力ディレクトリを作成
    mkdirSync(OUTPUT_DIR, { recursive: true });
    
    // OpenAPI スキーマを読み込み
    const openApiSchema = loadOpenAPISchema();
    console.log(`📖 OpenAPI スキーマを読み込みました: ${openApiSchema.info?.title} v${openApiSchema.info?.version}`);
    
    // HTML ドキュメントを生成
    const htmlContent = generateHTMLDocumentation(openApiSchema);
    
    // ファイルに書き込み
    writeFileSync(OUTPUT_PATH, htmlContent, 'utf8');
    
    console.log(`✅ HTML ドキュメントの生成が完了しました: ${OUTPUT_PATH}`);
    console.log(`📊 ${Object.keys(openApiSchema.paths || {}).length} 個のエンドポイントを生成しました`);
    
  } catch (error) {
    console.error('❌ HTML ドキュメントの生成に失敗しました:', error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみ実行
if (require.main === module) {
  main();
}

export { main as generateHTMLDocumentation };
