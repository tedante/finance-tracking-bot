function formatCurrency(amount) {
  return `$${amount.toLocaleString('en-US')}`;
}

function parseCommandArgs(text) {
  const args = text.split(' ');
  const amount = parseInt(args[1]);
  const description = args.slice(2).join(' ');

  return { amount, description };
}

module.exports = {
  formatCurrency,
  parseCommandArgs,
};
