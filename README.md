# ExpenseMate

A clean, fully offline expense tracker for Android and iOS, built with React Native + Expo.

Track daily spending, see where your money goes each month, and keep everything on your own device — no account, no server, no tracking.

**Author:** Priyanshu Kumar Thakur (Gravion) — [github.com/gravion-ux](https://github.com/gravion-ux)

## Features

- **Add / edit / delete expenses** — amount, category, note and date, with input validation
- **8 built-in categories** with icons and colours (Food & Drink, Travel, Shopping, Bills & Utilities, Health, Entertainment, Education, Other)
- **Monthly summary** on the home screen — total spent this month at a glance
- **Statistics screen**
  - Per-category breakdown with proportional bars (drawn with plain Views — no chart library)
  - Month navigation (browse previous months)
  - Biggest expense of the month
  - Last-6-months spending trend
- **Search & filter** — by note text, category, or both
- **Local persistence** with AsyncStorage — works 100% offline, data never leaves the device
- **Currency setting** — ₹ (INR), $ (USD), € (EUR), £ (GBP)
- **Dark theme** throughout

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React Native 0.76 + Expo SDK 52 |
| Language | TypeScript |
| Navigation | React Navigation (bottom tabs + native stack) |
| State | React Context + `useReducer` (pure, unit-tested reducer) |
| Storage | `@react-native-async-storage/async-storage` |
| Tests | Jest + ts-jest (logic layer) |

## Project structure

```
├── App.tsx                     # Navigation root (tabs + modal editor stack)
├── app.json                    # Expo config
├── src/
│   ├── types.ts                # Expense / Category / filter types
│   ├── theme.ts                # Dark theme tokens
│   ├── components/
│   │   ├── ExpenseItem.tsx     # One expense row
│   │   ├── BreakdownBar.tsx    # Category bar for the Stats screen
│   │   └── CategoryFilter.tsx  # Filter chips for the Home screen
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Summary card, search, filter, list, add button
│   │   ├── AddExpenseScreen.tsx# Add / edit form (also handles delete)
│   │   ├── StatsScreen.tsx     # Monthly breakdown + 6-month trend
│   │   └── SettingsScreen.tsx  # Currency picker, data info, delete-all
│   ├── store/
│   │   ├── expenseReducer.ts   # Pure reducer: ADD / UPDATE / DELETE / HYDRATE / CLEAR
│   │   └── ExpenseContext.tsx  # Context provider + AsyncStorage persistence
│   └── utils/
│       ├── categories.ts       # Category catalogue
│       ├── format.ts           # Money / date formatting & parsing
│       └── aggregate.ts        # Totals, monthly aggregation, breakdown, filtering
└── __tests__/                  # Jest tests for the whole logic layer
```

The business logic (formatting, aggregation, filtering, the store reducer) is kept
completely free of React Native imports, so it is unit-tested in plain Node with Jest.

## Getting started

Prerequisites: Node.js 18+ and the [Expo Go](https://expo.dev/go) app on your phone
(or an Android/iOS emulator).

```bash
npm install
npm start
```

Scan the QR code with Expo Go, or press `a` / `i` in the terminal for an emulator.

## Tests

```bash
npm test          # 32 Jest tests: formatting, aggregation, filtering, reducer
npm run typecheck # tsc --noEmit
```

To verify a production bundle locally:

```bash
npx expo export --platform android
```

## Notes

- Amounts are entered in major units (e.g. `250` or `250.50`); all totals are
  rounded to 2 decimals to avoid floating-point drift.
- Deleting data: Settings → "Delete all expenses" wipes the local store.
