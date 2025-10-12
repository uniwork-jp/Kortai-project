# Local Test Execution File

This directory contains a local test execution file that allows you to test the NaturalLanguageHandler functionality locally with natural Japanese scenarios.

## File

- `test-local.ts` - TypeScript version with Japanese scenario testing

## Usage

### Prerequisites

Make sure you have the required dependencies installed:

```bash
pnpm install
```

### Running Tests

#### Run All Japanese Scenario Tests

```bash
pnpm run test:local
```

#### Direct Execution

```bash
ts-node test-local.ts
```

## Test Features

### 🧪 Japanese Scenario Tests

The local tests include the following natural Japanese scenarios:

1. **Japanese Meeting Request**
   - Input: `明日の午後2時にジョンとの会議を1時間スケジュールしてください`
   - Tests Japanese natural language processing for meeting creation

2. **Japanese Appointment Reminder**
   - Input: `来週金曜日の午前10時に歯医者の予約をリマインダーとして作成`
   - Tests Japanese natural language processing for appointment scheduling

3. **Japanese Update Request**
   - Input: `会議の時間を午後3時に変更してください`
   - Tests Japanese natural language processing for event updates

4. **Japanese Delete Request**
   - Tests calendar event deletion functionality

### 🔧 GPT-5 Nano Configuration Testing

- Verifies GPT-5 nano model usage
- Confirms temperature setting to 1
- Validates Japanese instruction processing
- Tests prompt template generation

### 📊 Mock Services

The local tests use mock implementations:

- **MockGPTService**: Simulates GPT API responses with Japanese input processing
- **MockEventValidator**: Validates event data
- **MockCalendarService**: Simulates calendar operations

## Output Example

```
🧪 NaturalLanguageHandler Local Test Runner
📅 Testing Japanese scenarios with GPT-5 nano configuration

📋 Test: Japanese Meeting Request
📝 Input: "明日の午後2時にジョンとの会議を1時間スケジュールしてください"
👤 User ID: test-user-1
--------------------------------------------------
🤖 GPT Service called with input: 明日の午後2時にジョンとの会議を1時間スケジュールしてください
📝 Processing with Japanese instruction...
✅ Event validation passed
📅 Date normalization completed
📅 Calendar event created for user: test-user-1
📋 Event details: {
  summary: '会議',
  description: '自然言語から生成: 明日の午後2時にジョンとの会議を1時間スケジュールしてください',
  start: { dateTime: '2024-01-15T14:00:00+09:00', timeZone: 'Asia/Tokyo' },
  end: { dateTime: '2024-01-15T15:00:00+09:00', timeZone: 'Asia/Tokyo' },
  attendees: [{ email: 'john@example.com', displayName: 'ジョン' }]
}
✅ Create request completed successfully
📊 Result: {
  kind: 'calendar#event',
  summary: '会議',
  description: '自然言語から生成: 明日の午後2時にジョンとの会議を1時間スケジュールしてください',
  start: { dateTime: '2024-01-15T14:00:00+09:00', timeZone: 'Asia/Tokyo' },
  end: { dateTime: '2024-01-15T15:00:00+09:00', timeZone: 'Asia/Tokyo' },
  attendees: [{ email: 'john@example.com', displayName: 'ジョン' }]
}
--------------------------------------------------

📋 Test: Japanese Appointment Reminder
📝 Input: "来週金曜日の午前10時に歯医者の予約をリマインダーとして作成"
👤 User ID: test-user-2
--------------------------------------------------
🤖 GPT Service called with input: 来週金曜日の午前10時に歯医者の予約をリマインダーとして作成
📝 Processing with Japanese instruction...
✅ Event validation passed
📅 Date normalization completed
📅 Calendar event created for user: test-user-2
📋 Event details: {
  summary: '予約',
  description: '自然言語から生成: 来週金曜日の午前10時に歯医者の予約をリマインダーとして作成',
  start: { dateTime: '2024-01-15T14:00:00+09:00', timeZone: 'Asia/Tokyo' },
  end: { dateTime: '2024-01-15T15:00:00+09:00', timeZone: 'Asia/Tokyo' },
  attendees: []
}
✅ Create request completed successfully
📊 Result: {
  kind: 'calendar#event',
  summary: '予約',
  description: '自然言語から生成: 来週金曜日の午前10時に歯医者の予約をリマインダーとして作成',
  start: { dateTime: '2024-01-15T14:00:00+09:00', timeZone: 'Asia/Tokyo' },
  end: { dateTime: '2024-01-15T15:00:00+09:00', timeZone: 'Asia/Tokyo' },
  attendees: []
}
--------------------------------------------------

📋 Test: Japanese Update Request
📝 Input: "会議の時間を午後3時に変更してください"
👤 User ID: test-user-3
--------------------------------------------------
🤖 GPT Service called with input: 会議の時間を午後3時に変更してください
📝 Processing with Japanese instruction...
✅ Event validation passed
📅 Date normalization completed
📝 Calendar event updated: existing-event-123
✅ Update request completed successfully
📊 Result: {
  kind: 'calendar#event',
  summary: '会議',
  description: '自然言語から生成: 会議の時間を午後3時に変更してください',
  start: { dateTime: '2024-01-15T14:00:00+09:00', timeZone: 'Asia/Tokyo' },
  end: { dateTime: '2024-01-15T15:00:00+09:00', timeZone: 'Asia/Tokyo' },
  attendees: []
}
--------------------------------------------------

📋 Test: Japanese Delete Request
🗑️ Deleting event: test-event-123
--------------------------------------------------
🗑️ Calendar event deleted: test-event-123
✅ Delete request completed successfully
--------------------------------------------------

✨ All Japanese scenario tests completed successfully!
💡 To run the full test suite, use: pnpm test
```

## Benefits

1. **Natural Japanese Testing**: Tests with realistic Japanese natural language input
2. **One Scenario Per Test**: Each test focuses on a single scenario for clarity
3. **TypeScript Support**: Full type checking and IDE support
4. **Fast Execution**: No Jest overhead, runs directly
5. **Real-time Feedback**: See results immediately
6. **Debugging**: Easy to add console.log statements
7. **Development**: Perfect for development and testing

## Integration with Development

This local test file is perfect for:

- **Development**: Test changes quickly during development
- **Debugging**: Add logging and debug specific scenarios
- **Japanese Language Support**: Verify Japanese natural language processing
- **Prototyping**: Test new features before writing formal tests

## Next Steps

After running local tests successfully:

1. Run the full Jest test suite: `pnpm test`
2. Run with coverage: `pnpm run test:coverage`
3. Deploy to Firebase: `pnpm run deploy`

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Make sure `ts-node` is installed
2. **Import errors**: Ensure the project is built (`pnpm run build`)
3. **Mock issues**: Check that mock implementations match the real interfaces

### Getting Help

```bash
# Show help
ts-node test-local.ts --help
```