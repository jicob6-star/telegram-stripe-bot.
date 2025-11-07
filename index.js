import express from "express";
import bodyParser from "body-parser";
import Stripe from "stripe";
import axios from "axios";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(bodyParser.json());

// ✅ Webhook endpoint (Stripe will call this after payment success)
app.post("/webhook", async (req, res) => {
  const event = req.body;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Replace with your Telegram bot info
    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `💸 Payment received! $${session.amount_total / 100}`;

    await axios.post(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });
  }

  res.json({ received: true });
});

app.get("/", (req, res) => {
  res.send("Bot backend is running ✅");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
