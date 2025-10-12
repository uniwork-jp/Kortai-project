# TYPE\_DEFINITION\_GUIDE

## 📘 このドキュメントについて

本ドキュメントは、AI Assistant プロジェクトにおける OpenAPI 仕様を基にした型定義とAPIクライアントの自動生成について説明します。

---

## 🎯 概要
* **OpenAPI YAML を唯一のソースオブトゥルースに統一**
* OpenAPI YAML から **TypeScript 型** を自動生成
* OpenAPI YAML から **Zod スキーマ + クライアント** を自動生成
* 生成物を Turborepo の `packages/` 内に配置し、フロントエンド・バックエンド双方で利用

---

## 📦 ディレクトリ構成

```
AI-Assistant/
├── apps/
│   ├── backend/             # Firebase Functions backend
│   │   ├── firebase.json
│   │   └── functions/
│   └── frontend/            # Frontend applications
│       ├── app/
│       └── documents/
├── packages/
│   ├── config/              # Configuration utilities (env.ts)
│   ├── types/               # OpenAPIから生成された型 (新規作成)
│   ├── api-client/          # Zodスキーマ＋APIクライアント (新規作成)
│   └── utils/               # 共通ユーティリティ (firebaseClient.ts)
└── openapi/
    ├── schema.yaml          # API仕様 (ソースオブトゥルース) (新規作成)
    └── TYPE_DEFINITION_GUIDE.md
```

---

## 🔑 実装ステップ

### 1. OpenAPI YAML を定義

例: `openapi/schema.yaml`

```yaml
openapi: 3.0.3
info:
  title: AI Assistant API
  version: 1.0.0
  description: API for AI Assistant application
paths:
  /api/chat:
    post:
      summary: Send message to AI assistant
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ChatMessageInput"
      responses:
        "200":
          description: AI response
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ChatMessageResponse"
  /api/conversations:
    get:
      summary: Get user conversations
      responses:
        "200":
          description: List of conversations
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Conversation"
components:
  schemas:
    ChatMessageInput:
      type: object
      properties:
        message:
          type: string
        conversationId:
          type: string
          nullable: true
      required: [message]
    ChatMessageResponse:
      type: object
      properties:
        id:
          type: string
        message:
          type: string
        timestamp:
          type: string
          format: date-time
        conversationId:
          type: string
    Conversation:
      type: object
      properties:
        id:
          type: string
        title:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
```

### 2. TypeScript 型生成

```bash
npm install --save-dev openapi-typescript
npx openapi-typescript ./openapi/schema.yaml -o ./packages/types/src/api.d.ts
```

生成結果例:

```ts
export interface paths {
  "/api/chat": {
    post: {
      requestBody: {
        content: {
          "application/json": {
            message: string;
            conversationId?: string | null;
          };
        };
      };
      responses: {
        200: {
          content: {
            "application/json": {
              id: string;
              message: string;
              timestamp: string;
              conversationId: string;
            };
          };
        };
      };
    };
  };
  "/api/conversations": {
    get: {
      responses: {
        200: {
          content: {
            "application/json": Array<{
              id: string;
              title: string;
              createdAt: string;
              updatedAt: string;
            }>;
          };
        };
      };
    };
  };
}
```

### 3. Zod スキーマ + クライアント生成

```bash
npm install --save-dev openapi-zod-client
npx openapi-zod-client ./openapi/schema.yaml --output ./packages/api-client/index.ts
```

これにより:

* **Zod スキーマ** (リクエスト・レスポンス検証)
* **型安全な API クライアント**
  が自動生成されます。

### 4. 型共有フロー

```
OpenAPI YAML
   │
   ├─ openapi-typescript → TypeScript 型 (定義専用)
   │
   └─ openapi-zod-client → Zod スキーマ + クライアント (実装用)
```

---

## ✅ まとめ

1. **OpenAPI YAML を唯一のソースオブトゥルースに統一**
2. `openapi-typescript` で **型定義ファイルを自動生成**
3. `openapi-zod-client` で **Zod スキーマ + クライアントを生成**
4. `packages/` に配置し、**フロント・バックエンドで共通利用**

---

