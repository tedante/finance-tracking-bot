# Family Finance Tracking Bot

A Telegram bot for tracking family income and expenses with logging to Google Sheets.

## Features

- 💰 Track expenses and income through Telegram commands
- 📊 logging to Google Sheets
- 🏷️ Category-based transaction organization

## Prerequisites

- Node.js (v14 or higher)
- A Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- A Google Service Account with Google Sheets API access
- A Google Spreadsheet for storing transactions

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd family-finance-bot
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
BOT_TOKEN="your-telegram-bot-token"
SPREADSHEET_ID="your-google-spreadsheet-id"
ALLOWED_GROUP_ID="your-telegram-group-id"

# Google Service Account Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
```

## Setup Guide

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` and follow the instructions
3. Copy the bot token and add it to your `.env` file

### 2. Get Your Group ID

1. Add your bot to your Telegram group
2. Send a message in the group
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Find the `"chat":{"id":` value in the JSON response
5. Add this ID to your `.env` file as `ALLOWED_GROUP_ID`

### 3. Setup Google Sheets

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Give it a name and click "Create"
   - Grant it the "Editor" role
   - Click "Done"
5. Create a key for the service account:
   - Click on the created service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose JSON format
   - The key will be downloaded
6. Copy the `client_email` and `private_key` from the downloaded JSON to your `.env` file
7. Create a Google Spreadsheet with the following columns:

   - Tanggal (Date)
   - Tipe (Type)
   - Nominal (Amount)
   - Deskripsi (Description)
   - Kategori (Category)
   - User

   **Example spreadsheet structure:**

   | Tanggal                | Tipe    | Nominal | Deskripsi           | Kategori  | User |
   | ---------------------- | ------- | ------- | ------------------- | --------- | ---- |
   | 1/17/2026, 10:30:00 AM | Expense | 50      | Lunch at restaurant | Food      | John |
   | 1/17/2026, 2:45:00 PM  | Expense | 20      | Taxi to office      | Transport | Jane |
   | 1/17/2026, 6:00:00 PM  | Income  | 1000    | Monthly salary      | Shopping  | John |
   | 1/17/2026, 8:15:00 PM  | Expense | 150     | Electric bill       | Utilities | Jane |

8. Share the spreadsheet with the service account email (the one in `GOOGLE_SERVICE_ACCOUNT_EMAIL`)
9. Copy the spreadsheet ID from the URL and add it to your `.env` file

## Usage

### Start the Bot

```bash
npm start
```

### Commands

#### Track Expenses

```
/out [amount] [description]
```

Example: `/out 50 Lunch at restaurant`

#### Track Income

```
/in [amount] [description]
```

Example: `/in 1000 Monthly salary`

After sending a command, the bot will show category buttons. Select the appropriate category to complete the transaction.

### Available Categories

- 🍕 Food
- 🚗 Transport
- ⚡ Utilities
- 🛍️ Shopping

You can easily add more categories by editing [`src/constants/categories.js`](src/constants/categories.js).

## Project Structure

```
family-finance-bot/
├── src/
│   ├── config/
│   │   └── index.js              # Configuration and environment variables
│   ├── constants/
│   │   └── categories.js         # Transaction categories
│   ├── handlers/
│   │   └── transactions.js       # Bot command and action handlers
│   ├── services/
│   │   └── sheets.js             # Google Sheets integration
│   ├── utils/
│   │   └── helpers.js            # Utility functions
│   └── index.js                  # Application entry point
├── .env                          # Environment variables (not in git)
├── package.json
└── README.md
```

## Adding New Categories

Edit [`src/constants/categories.js`](src/constants/categories.js):

```javascript
const categories = [
  { name: "Food", icon: "🍕", key: "Food" },
  { name: "Transport", icon: "🚗", key: "Transport" },
  { name: "Utilities", icon: "⚡", key: "Utilities" },
  { name: "Shopping", icon: "🛍️", key: "Shopping" },
  { name: "Healthcare", icon: "🏥", key: "Healthcare" }, // Add new category
];
```

## Security Notes

- Keep your `.env` file secure and never commit it to version control
- Add `.env` to your `.gitignore` file
- The bot only responds to messages from the configured `ALLOWED_GROUP_ID`
- Your Google Service Account credentials should be kept confidential

## Troubleshooting

### Bot doesn't respond

- Check that the bot is added to your group
- Verify the `ALLOWED_GROUP_ID` is correct
- Ensure the bot has permission to read and send messages in the group

### Google Sheets errors

- Verify the service account has access to the spreadsheet
- Check that the `SPREADSHEET_ID` is correct
- Ensure the sheet has the correct column headers

### Private key errors

- Make sure the private key includes the full key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep the `\n` characters in the private key string

## License

ISC

## Contributing

Feel free to open issues or submit pull requests for improvements!
