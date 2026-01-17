const config = require('../config');
const sheetsService = require('../services/sheets');
const { getCategoryKeyboard } = require('../constants/categories');
const { formatCurrency, parseCommandArgs } = require('../utils/helpers');

// Temporary storage for pending transactions
const pendingTransactions = new Map();

async function handleTransactionCommand(ctx) {
  // Security: Check if message is from the allowed group
  if (ctx.chat.id.toString() !== config.allowedGroupId) return;

  const { amount, description } = parseCommandArgs(ctx.message.text);

  if (isNaN(amount)) {
    return ctx.reply('Invalid format! Use: /out [amount] [description]');
  }

  const type = ctx.message.text.startsWith('/out') ? 'Expense' : 'Income';

  // Store pending data
  pendingTransactions.set(ctx.message.message_id, {
    amount,
    description,
    type,
    user: ctx.from.first_name,
  });

  // Show Inline Buttons
  return ctx.reply(
    `Select Category for ${type} ${formatCurrency(amount)}:`,
    getCategoryKeyboard(ctx.message.message_id)
  );
}

async function handleCategorySelection(ctx) {
  const category = ctx.match[1];
  const msgId = parseInt(ctx.match[2]);
  const data = pendingTransactions.get(msgId);

  if (!data) {
    return ctx.answerCbQuery('Data expired.');
  }

  try {
    await sheetsService.addTransaction({
      type: data.type,
      amount: data.amount,
      description: data.description,
      category: category,
      user: data.user,
    });

    pendingTransactions.delete(msgId);
    await ctx.editMessageText(
      `✅ Successfully recorded **${category}**: ${formatCurrency(data.amount)} (${data.description})`
    );
  } catch (error) {
    console.error('Error adding transaction:', error);
    await ctx.answerCbQuery('Failed to record transaction.');
  }
}

module.exports = {
  handleTransactionCommand,
  handleCategorySelection,
  pendingTransactions,
};
