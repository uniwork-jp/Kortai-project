# API エンドポイントマップ

このドキュメントでは、AI AssistantアプリケーションのAPI エンドポイントの一覧と用途を整理しています。

---

## 1. Googleカレンダー API

### `/schedule`
- **Method**: POST
  - **Description**: 自然言語テキストを受け取り、カレンダーイベントの作成が可能かどうかを判定
  - **Request**: 
    - Content-Type: application/json
    - Body: 自然言語テキスト
  - **Response**: 
    - true: イベント作成可能
    - false: イベント作成不可

- **Method**: GET
  - **Description**: スケジュールされたイベントの一覧を取得
  - **Request**: 
    - Query parameters: date, calendar_id (optional)
  - **Response**: 
    - Array of calendar events

- **Method**: DELETE
  - **Description**: 指定されたイベントを削除
  - **Request**: 
    - Path parameter: event_id
  - **Response**: 
    - Success: 200 OK
    - Error: 404 Not Found

- **Method**: PATCH
  - **Description**: 既存のイベントを更新
  - **Request**: 
    - Path parameter: event_id
    - Content-Type: application/json
    - Body: 更新するイベント情報
  - **Response**: 
    - Updated event object


