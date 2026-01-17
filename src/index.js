const { Telegraf } = require('telegraf');
const config = require('./config/index');
const { handleTransactionCommand, handleCategorySelection } = require('./handlers/transactions');

// Initialize bot
const bot = new Telegraf(config.botToken);

// Register command handlers
bot.command(['out', 'in'], handleTransactionCommand);

// Handle button clicks for category selection
bot.action(/cat_(.+)_(.+)/, handleCategorySelection);

// Launch bot
bot.launch().then(() => {
  console.log('🚀 Bot started successfully!');
  console.log(`📡 Listening for messages in Group ID: ${config.allowedGroupId}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
