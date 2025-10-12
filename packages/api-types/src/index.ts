// API Types Package - Export集約
// このファイルは自動生成された型とZodスキーマを集約してエクスポートします

// Zod スキーマのエクスポート
export * from './zod';

// 共通の型定義
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, any>;
};
