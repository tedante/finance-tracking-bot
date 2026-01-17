require('dotenv').config();

module.exports = {
  botToken: process.env.BOT_TOKEN,
  spreadsheetId: process.env.SPREADSHEET_ID,
  allowedGroupId: process.env.ALLOWED_GROUP_ID,
  googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY,
};
