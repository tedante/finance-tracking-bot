require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

// Auth for Google
const serviceAccountAuth = new JWT({
  email: require('./credentials.json').client_email,
  key: require('./credentials.json').private_key,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const bot = new Telegraf(process.env.BOT_TOKEN);
const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);

// Temp storage for pending transactions
const pending = new Map();

bot.command(['out', 'in'], async (ctx) => {
  // Security: Check if message is from the allowed group
  if (ctx.chat.id.toString() !== process.env.ALLOWED_GROUP_ID) return;

  const args = ctx.message.text.split(' ');
  const amount = parseInt(args[1]);
  const desc = args.slice(2).join(' ');

  if (isNaN(amount)) return ctx.reply('Format salah! Gunakan: /out [jumlah] [keterangan]');

  const type = ctx.message.text.startsWith('/out') ? 'Pengeluaran' : 'Pemasukan';

  // Store pending data
  pending.set(ctx.message.message_id, { amount, desc, type, user: ctx.from.first_name });

  // Show Inline Buttons
  return ctx.reply(`Pilih Kategori untuk ${type} Rp${amount.toLocaleString('id-ID')}:`,
    Markup.inlineKeyboard([
      [Markup.button.callback('🍕 Makan', `cat_Makan_${ctx.message.message_id}`),
      Markup.button.callback('🚗 Transpor', `cat_Transpor_${ctx.message.message_id}`)],
      [Markup.button.callback('⚡ Listrik', `cat_Listrik_${ctx.message.message_id}`),
      Markup.button.callback('🛍️ Belanja', `cat_Belanja_${ctx.message.message_id}`)]
    ])
  );
});

// Handle Button Click
bot.action(/cat_(.+)_(.+)/, async (ctx) => {
  const category = ctx.match[1];
  const msgId = parseInt(ctx.match[2]);
  const data = pending.get(msgId);

  if (!data) return ctx.answerCbQuery('Data kadaluarsa.');

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  await sheet.addRow({
    Tanggal: new Date().toLocaleString('id-ID'),
    Tipe: data.type,
    Nominal: data.amount,
    Deskripsi: data.desc,
    Kategori: category,
    User: data.user
  });

  pending.delete(msgId);
  await ctx.editMessageText(`✅ Berhasil mencatat **${category}**: Rp${data.amount.toLocaleString('id-ID')} (${data.desc})`);
});

bot.launch().then(() => {
  console.log('🚀 Rin: Bot started successfully in local mode!');
  console.log(`📡 Listening for messages in Group ID: ${process.env.ALLOWED_GROUP_ID}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
