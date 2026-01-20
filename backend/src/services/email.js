const nodemailer = require("nodemailer");
const { user, password } = require("../config/mail");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: user,
    pass: password
  },
  pool: true, // Enable connection pooling
  maxConnections: 5, // Max concurrent connections
  maxMessages: 100, // Max messages per connection
  rateDelta: 1000, // Minimum time between messages (1 second)
  rateLimit: 5, // Max 5 messages per rateDelta
  tls: {
    rejectUnauthorized: false // Add if you're having SSL issues
  },
  debug: false, 
  logger: false 
});

// Add connection verification
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

exports.sendPassEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Visitor Pass System" <${process.env.MAIL_USER || user}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    throw error;
  }
};

exports.sendCancellationEmail = async ({ to, subject, html, type = 'visitor' }) => {
  try {
    if (!to) {
      console.log('⚠️ No recipient email provided for cancellation');
      return null;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Visitor Pass System" <${process.env.MAIL_USER || user}>`,
      to,
      subject,
      html,
      headers: {
        'X-Cancellation-Type': type,
        'X-Auto-Response-Suppress': 'All'
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send cancellation email to ${to}:`, error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    throw error;
  }
};

exports.sendBulkCancellationEmails = async (emails) => {
  const results = [];
  
  for (const email of emails) {
    try {
      const info = await exports.sendCancellationEmail(email);
      results.push({ email: email.to, success: true, messageId: info?.messageId });
      
      // Add delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({ email: email.to, success: false, error: error.message });
    }
  }
  
  return results;
};