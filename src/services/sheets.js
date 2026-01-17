const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const config = require('../config');

class SheetsService {
  constructor() {
    this.serviceAccountAuth = new JWT({
      email: config.googleServiceAccountEmail,
      key: config.googlePrivateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.doc = new GoogleSpreadsheet(config.spreadsheetId, this.serviceAccountAuth);
  }

  async addTransaction(transaction) {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByIndex[0];

    await sheet.addRow({
      Tanggal: new Date().toLocaleString('en-US'),
      Tipe: transaction.type,
      Nominal: transaction.amount,
      Deskripsi: transaction.description,
      Kategori: transaction.category,
      User: transaction.user
    });
  }
}

module.exports = new SheetsService();
