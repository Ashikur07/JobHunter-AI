import { sendVerificationEmail } from '../../../lib/mail';
import { User } from '../../../models/User';

const telegramBot = require('node-telegram-bot-api');
const bot = new telegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! Please provide your email to connect for website login.');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const email = msg.text;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return bot.sendMessage(chatId, 'Please provide a valid email address.');
  }

  // Check if the email exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return bot.sendMessage(chatId, 'This email is not registered. Please try again or register on the website.');
  }

  // Send verification email
  const token = user.generateVerificationToken(); // Assuming a method to generate a token
  const emailSent = await sendVerificationEmail(email, token);

  if (emailSent) {
    bot.sendMessage(chatId, 'A verification email has been sent to your email address. Please check your inbox.');
  } else {
    bot.sendMessage(chatId, 'Failed to send verification email. Please try again later.');
  }
});

// Handle verification callback (this should be set up in your verification route)
bot.onText(/\/verify (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const token = match[1];

  // Verify the token (implement your verification logic)
  const user = await User.verifyToken(token); // Assuming a method to verify the token
  if (user) {
    bot.sendMessage(chatId, 'Your email has been verified! The bot is now active for you.');
  } else {
    bot.sendMessage(chatId, 'Verification failed. Please check your token and try again.');
  }
});