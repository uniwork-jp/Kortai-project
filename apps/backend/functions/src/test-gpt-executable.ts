#!/usr/bin/env node

/**
 * GPTService 実行ファイル
 * ハードコードされた引数でGPTServiceをテスト実行
 */

// 環境変数を読み込み
import * as dotenv from 'dotenv';
import * as path from 'path';

// プロジェクトルートのenv.localを読み込み
dotenv.config({ path: path.resolve(__dirname, '../../../../env.local') });

// デバッグ: 環境変数の読み込み確認
console.log('🔍 環境変数確認:');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '設定済み' : '未設定');
console.log('env.local パス:', path.resolve(__dirname, '../../../../env.local'));

import { GPTService } from './services/GPTService';

async function main() {
  console.log('🚀 GPTService 実行テスト開始');
  console.log('=====================================');

  const gptService = new GPTService();

  // ハードコードされたテストケース
  const testInput = "明後日１５時から１半時間MTG入れてほしい";
  
  console.log(`📝 テストケース:`);
  console.log(`入力: "${testInput}"`);
  
  
  try {
    const result = await gptService.parseToEvent(testInput);
    
    console.log('✅ 実行成功!');
    console.log('📅 結果:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('❌ 実行エラー:');
    console.log(error instanceof Error ? error.message : String(error));
  }

  console.log('\n🏁 テスト完了');
}

// 実行
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 メイン実行エラー:', error);
    process.exit(1);
  });
}

export { main };
