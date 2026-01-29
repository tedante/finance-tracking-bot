const { Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// Load categories from JSON file
const categoriesPath = path.join(__dirname, '../../categories.json');
let categories = [];

try {
  const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
  categories = JSON.parse(categoriesData);
} catch (error) {
  console.error('Error loading categories.json:', error.message);
  console.error('Please copy categories.example.json to categories.json');
  process.exit(1);
}

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
