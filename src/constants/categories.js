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
  // Group categories by their group field
  const grouped = {};
  categories.forEach(cat => {
    const group = cat.group || 'Other';
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(cat);
  });

  const rows = [];

  // Get unique groups in the order they appear in categories.json
  const groupOrder = [...new Set(categories.map(cat => cat.group).filter(Boolean))];

  groupOrder.forEach(groupName => {
    if (grouped[groupName]) {
      // Add group header as a non-clickable button
      rows.push([Markup.button.callback(`━━━ ${groupName} ━━━`, `header_${groupName}`)]);

      // Add category buttons for this group (2 columns)
      const groupButtons = grouped[groupName].map(cat =>
        Markup.button.callback(`${cat.icon} ${cat.name}`, `cat_${cat.key}_${messageId}`)
      );

      for (let i = 0; i < groupButtons.length; i += 2) {
        rows.push(groupButtons.slice(i, i + 2));
      }
    }
  });

  return Markup.inlineKeyboard(rows);
}

module.exports = {
  categories,
  getCategoryKeyboard,
};
