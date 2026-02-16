const sgMail = require('@sendgrid/mail');

sgMail.setApiKey((process.env.SENDGRID_API_KEY || '').trim());

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, phone, service, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    // Email to business
    const notificationEmail = {
      to: 'precisionprocourts@gmail.com',
      from: { email: 'noreply@gullstack.com', name: 'Precision Pro Courts Website' },
      replyTo: email,
      subject: `New Lead: ${name}${service ? ` - ${service}` : ''}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🏀 New Contact Form Submission</h1>
          </div>
          <div style="padding: 32px; background: #f9f9f9;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600;">Name</td><td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">${name}</td></tr>
              <tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600;">Email</td><td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;"><a href="mailto:${email}">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600;">Phone</td><td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;"><a href="tel:${phone}">${phone}</a></td></tr>` : ''}
              ${service ? `<tr><td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600;">Service</td><td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">${service}</td></tr>` : ''}
            </table>
            <div style="margin-top: 24px;">
              <h3 style="margin: 0 0 12px 0; font-size: 16px;">Message</h3>
              <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e5e5;">
                ${(message || 'No message').replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
        </div>
      `
    };

    // Auto-reply to customer
    const autoReplyEmail = {
      to: email,
      from: { email: 'noreply@gullstack.com', name: 'Precision Pro Courts' },
      replyTo: 'precisionprocourts@gmail.com',
      subject: 'Thanks for contacting Precision Pro Courts!',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a1a2e; color: white; padding: 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🏀 Precision Pro Courts</h1>
          </div>
          <div style="padding: 32px;">
            <p style="font-size: 18px; margin: 0 0 16px 0;">Hi ${name.split(' ')[0]},</p>
            <p style="margin: 0 0 16px 0; line-height: 1.7;">Thank you for reaching out! We received your message and will get back to you within 24 hours with a free quote.</p>
            <p style="margin: 0 0 16px 0; line-height: 1.7;">In the meantime, check out our <a href="https://precisionprocourts.com/gallery/" style="color: #3b82f6;">project gallery</a> or try our <a href="https://precisionprocourts.com/court-designer/" style="color: #3b82f6;">Court Designer</a> tool!</p>
            <p style="margin: 24px 0 0 0;">Best regards,<br><strong>The Precision Pro Courts Team</strong></p>
          </div>
          <div style="padding: 24px; background: #f9f9f9; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="margin: 0; color: #737373; font-size: 14px;">Utah's Premier Sport Court Builder</p>
          </div>
        </div>
      `
    };

    await Promise.all([
      sgMail.send(notificationEmail),
      sgMail.send(autoReplyEmail)
    ]);

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('SendGrid error:', error.message);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
};
