const { Markup } = require('telegraf');

const categories = [
  { name: 'Food', icon: '🍕', key: 'Food' },
  { name: 'Transport', icon: '🚗', key: 'Transport' },
  { name: 'Utilities', icon: '⚡', key: 'Utilities' },
  { name: 'Shopping', icon: '🛍️', key: 'Shopping' },
];

function getCategoryKeyboard(messageId) {
  const buttons = categories.map(cat =>
    Markup.button.callback(`${cat.icon} ${cat.name}`, `cat_${cat.key}_${messageId}`)
  );

  // Create 2 columns
  const rows = [];
  for (let i = 0; i < buttons.length; i += 2) {
    rows.push(buttons.slice(i, i + 2));
  }

  return Markup.inlineKeyboard(rows);
}

module.exports = {
  categories,
  getCategoryKeyboard,
};
