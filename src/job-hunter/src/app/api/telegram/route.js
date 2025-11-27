import { sendVerificationEmail } from '../../../lib/mail';
import { User } from '../../../models/User';
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome! Please connect your email for website login.');
});

bot.on('text', async (ctx) => {
  const email = ctx.message.text;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return ctx.reply('Please provide a valid email address.');
  }

  // Check if the email exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return ctx.reply('This email is not registered. Please try again or register on the website.');
  }

  // Send verification email
  const token = user.generateVerificationToken(); // Assuming you have a method to generate a token
  const emailSent = await sendVerificationEmail(email, token);

  if (emailSent) {
    ctx.reply('A verification email has been sent to your email address. Please check your inbox.');
  } else {
    ctx.reply('There was an error sending the verification email. Please try again later.');
  }

  // Handle verification logic (this part should be handled in your email verification route)
  // You may want to store the user's chat ID to activate the bot later
});

// Activate the bot
bot.launch();