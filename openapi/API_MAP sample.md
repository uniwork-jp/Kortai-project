# API エンドポイントマップ

このドキュメントでは、AI AssistantアプリケーションのAPI エンドポイントの一覧と用途を整理しています。

---

## 1. 認証関連 API

| エンドポイント             | メソッド | 説明                                            | 入力                                    | 出力                                      |
| ------------------- | ---- | --------------------------------------------- | ------------------------------------- | --------------------------------------- |
| `/api/auth/line`    | POST | LIFF から送られた idToken を検証し Firebase カスタムトークンを発行 | `{ idToken, accessToken?, profile? }` | `{ firebaseUid, customToken, decoded }` |
| `/api/auth/session` | GET  | NextAuth.js セッション取得                           | Cookie                                | `{ user: { firebaseUid, ... } }`        |

---

## 2. ユーザー情報取得 API

| エンドポイント                  | メソッド | 説明                                | 入力                                       | 出力                                                   |
| ------------------------ | ---- | --------------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| `/api/user/profile`      | GET  | Firebase UID からユーザー情報取得           | Cookie / JWT                             | `{ userId, displayName, pictureUrl, statusMessage }` |
| `/api/user/line-profile` | GET  | LINE accessToken を使ってユーザープロフィール取得 | Header: Authorization Bearer accessToken | `{ userId, displayName, pictureUrl, statusMessage }` |

---

## 3. Gmail操作 API

| エンドポイント                  | メソッド | 説明                     | 入力                                             | 出力                                                      |
| ------------------------------ | -------- | ------------------------ | ------------------------------------------------ | --------------------------------------------------------- |
| `/api/gmail/messages`          | GET      | 受信メールの表示・一覧取得 | Cookie / JWT, Query: `{ page?, limit? }`         | `{ messages: [{ id, subject, sender, body, timestamp }] }` |
| `/api/gmail/messages/{id}`     | GET      | 特定メールの詳細表示       | Cookie / JWT                                     | `{ id, subject, sender, body, timestamp, attachments }`    |
| `/api/gmail/reply`             | POST     | メール返信                | `{ messageId, replyText, attachments? }`         | `{ success: true, replyId }`                              |

---

## 4. LINE チャット API

| エンドポイント          | メソッド | 説明               | 入力           | 出力                                      |
| ---------------- | ---- | ---------------- | ------------ | --------------------------------------- |
| `/api/line/chat` | POST | LINE チャットメッセージ送信 | `{ message, userId?, replyToken? }` | `{ success: true, messageId }` |

---

## 6. テストチャット API

| エンドポイント          | メソッド | 説明               | 入力           | 出力                                      |
| ---------------- | ---- | ---------------- | ------------ | --------------------------------------- |
| `/api/test-chat` | GET  | テストチャットエンドポイントのヘルスチェック | なし           | `{ message, timestamp, version, status }` |
| `/api/test-chat` | POST | テストチャットメッセージ送信 | `{ message, userId?, category? }` | `{ success, messageId, originalMessage, aiResponse, timestamp }` |

---

## 7. その他 API

| エンドポイント          | メソッド | 説明               | 入力           | 出力                                      |
| ---------------- | ---- | ---------------- | ------------ | --------------------------------------- |
| `/api/logout`    | POST | セッション破棄・ログアウト    | Cookie       | `{ success: true }`                     |
| `/api/protected` | GET  | 認証が必要な保護APIのサンプル | Cookie / JWT | `{ message: "This is protected data" }` |

---


