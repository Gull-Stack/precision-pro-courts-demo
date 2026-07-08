const sgMail = require('@sendgrid/mail');

sgMail.setApiKey((process.env.SENDGRID_API_KEY || '').trim());

// === SPAM PROTECTION (mirrors api/contact.js) ===
function isGibberish(text) {
  if (!text || text.length < 2) return false;
  const cleaned = text.toLowerCase().replace(/[^a-z]/g, '');
  if (cleaned.length < 2) return false;
  const vowels = cleaned.match(/[aeiou]/g);
  if (!vowels || vowels.length < cleaned.length * 0.15) return true;
  if (/[^aeiou]{5,}/i.test(cleaned)) return true;
  return false;
}

function looksLikeSpam(data) {
  const { name, company } = data;
  if (company) return 'honeypot';
  if (isGibberish(name)) return 'gibberish_name';
  if (name && name.trim().length < 2) return 'short_name';
  return false;
}
// === END SPAM PROTECTION ===

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
));

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, zip, message, design = {}, image, company } = req.body || {};

  const spamReason = looksLikeSpam({ name, company });
  if (spamReason) {
    console.log(`[SPAM BLOCKED] reason=${spamReason} name="${name}" email="${email}"`);
    return res.status(200).json({ success: true, message: 'Design sent successfully!' });
  }

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  // Parse the design PNG data URL into a SendGrid attachment (inline + downloadable)
  let attachments;
  const m = typeof image === 'string' && image.match(/^data:image\/png;base64,([A-Za-z0-9+/=]+)$/);
  if (m && m[1].length < 8_000_000) { // guard against oversized payloads (~6MB decoded)
    attachments = [{
      content: m[1],
      filename: 'court-design.png',
      type: 'image/png',
      disposition: 'inline',
      content_id: 'courtdesign',
    }];
  }

  const addOns = Array.isArray(design.addOns) && design.addOns.length ? design.addOns : ['None selected'];
  const specRow = (label, val) => val
    ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;width:150px;">${esc(label)}</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;">${esc(val)}</td></tr>`
    : '';

  try {
    const notificationEmail = {
      to: 'team@precisionprocourts.com',
      cc: 'bryce@gullstack.com',
      from: { email: 'noreply@gullstack.com', name: 'Precision Pro Courts Website' },
      replyTo: email,
      subject: `New Court Design Quote: ${name}${design.sport ? ` - ${design.sport}` : ''}`,
      attachments,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 620px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: white; padding: 24px; text-align: center;">
            <img src="https://precisionprocourts.com/assets/images/logos/logo-white-lg.png" alt="Precision Pro Courts" style="max-width: 240px; height: auto;" />
            <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.7;">Court Designer — Quote Request</p>
          </div>
          <div style="padding: 32px; background: #f9f9f9;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px;">Customer</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${specRow('Name', name)}
              <tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
              ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;font-weight:600;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #e5e5e5;"><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>` : ''}
              ${specRow('ZIP / City', zip)}
            </table>

            <h3 style="margin: 28px 0 12px 0; font-size: 16px;">Their Design</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${specRow('Sport', design.sport)}
              ${specRow('Playing surface', design.playSurface)}
              ${specRow('Kitchen', design.kitchen)}
              ${specRow('Surround', design.surround)}
              ${specRow('Lines', design.lines)}
              ${specRow('Add-ons', addOns.join(', '))}
            </table>

            ${attachments ? `<div style="margin-top: 24px; text-align:center;"><img src="cid:courtdesign" alt="Court design" style="max-width:100%; border-radius:8px; border:1px solid #e5e5e5;" /></div>` : ''}

            <div style="margin-top: 24px;">
              <h3 style="margin: 0 0 12px 0; font-size: 16px;">Message</h3>
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e5e5;">${esc(message || 'No message').replace(/\n/g, '<br>')}</div>
            </div>
          </div>
        </div>
      `,
    };

    const autoReplyEmail = {
      to: email,
      from: { email: 'noreply@gullstack.com', name: 'Precision Pro Courts' },
      replyTo: 'team@precisionprocourts.com',
      subject: 'Your court design is on its way to us!',
      attachments,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: white; padding: 24px; text-align: center;">
            <img src="https://precisionprocourts.com/assets/images/logos/logo-white-lg.png" alt="Precision Pro Courts" style="max-width: 240px; height: auto;" />
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 18px; margin: 0 0 16px 0;">Hi ${esc(name.split(' ')[0])},</p>
            <p style="margin: 0 0 16px 0; line-height: 1.7;">Thanks for designing your court with us! We got your ${design.sport ? esc(design.sport.toLowerCase()) + ' ' : ''}design and our team will follow up within 24 hours with a free, no-pressure quote.</p>
            ${attachments ? `<div style="margin: 20px 0; text-align:center;"><img src="cid:courtdesign" alt="Your court design" style="max-width:100%; border-radius:8px; border:1px solid #e5e5e5;" /></div>` : ''}
            <p style="margin: 24px 0 0 0;">Talk soon,<br><strong>The Precision Pro Courts Team</strong></p>
          </div>
          <div style="padding: 24px; background: #f9f9f9; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0; color: #737373; font-size: 14px;">Utah's Premier Sport Court Builder</p>
          </div>
        </div>
      `,
    };

    await Promise.all([sgMail.send(notificationEmail), sgMail.send(autoReplyEmail)]);
    return res.status(200).json({ success: true, message: 'Design sent successfully!' });
  } catch (error) {
    console.error('SendGrid error:', error.message);
    return res.status(500).json({ error: 'Failed to send design. Please try again.' });
  }
};
