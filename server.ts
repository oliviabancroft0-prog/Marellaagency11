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
  app.post('/api/send-confirmation', async (req, res) => {
    const { email, name, orderDetails, total } = req.body;
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'finance@braminghambarely.top';

    if (!apiKey || apiKey.trim() === '') {
      console.error('BREVO_API_KEY is missing. Add it to Settings.');
      return res.status(500).json({ error: 'Email configuration missing' });
    }

    // Securely check key format
    const trimmedKey = apiKey.trim();
    
    // Log for debugging (first/last few chars only)
    console.log(`Email attempt: Sender=${senderEmail}, Recipient=${email}, KeyPrefix=${trimmedKey.substring(0, 10)}...`);

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
