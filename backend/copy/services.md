below are the services files

admincancelmail.js

const { sendPassEmail } = require("./email");

exports.sendBulkCancellationMail = async ({ to, placeName, visitDate, reason }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #dc2626;">Event Cancelled</h2>
      <p>Dear Visitor,</p>
      <p>We regret to inform you that <strong>${placeName}</strong> scheduled on <strong>${visitDate.toDateString()}</strong> has been cancelled.</p>
      
      <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
      </div>
      
      <p>Your refund has been initiated and will be processed within 3-5 business days.</p>
      <p>We sincerely apologize for the inconvenience caused.</p>
      
      <p style="margin-top: 30px;">If you have any questions, please contact support.</p>
      
      <p style="margin-top: 20px;">Best regards,<br/>Visitor Pass Management Team</p>
    </div>
  `;

  await sendPassEmail({
    to,
    subject: `Event Cancelled – ${placeName}`,
    html
  });
};

exports.sendHostDisabledMail = async ({ to, reason }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #dc2626;">Hosting Access Disabled</h2>
      <p>Dear Host,</p>
      <p>Your hosting access has been disabled by the administration.</p>
      
      <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
      </div>
      
      <p>All your future events have been cancelled and visitors will be refunded.</p>
      <p>If you believe this is a mistake, please contact support immediately.</p>
      
      <p style="margin-top: 30px;">Best regards,<br/>Visitor Pass Management Team</p>
    </div>
  `;

  await sendPassEmail({
    to,
    subject: "Hosting Access Disabled",
    html
  });
};

exports.sendEventCancelledMail = async ({ to, placeName, reason }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #dc2626;">Event Cancelled by Admin</h2>
      <p>Dear Host,</p>
      <p>Your event <strong>${placeName}</strong> has been cancelled by the administration.</p>
      
      <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
      </div>
      
      <p>All visitors have been notified and refunds have been initiated.</p>
      <p>If you have any concerns, please contact support.</p>
      
      <p style="margin-top: 30px;">Best regards,<br/>Visitor Pass Management Team</p>
    </div>
  `;

  await sendPassEmail({
    to,
    subject: `Event Cancelled – ${placeName}`,
    html
  });
};

admininvitemail.js

const { sendPassEmail } = require("./email");

exports.sendAdminInviteMail = async ({ email, tempPassword }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4f46e5;">Admin Access Granted</h2>
      <p>You have been invited as an <strong>Administrator</strong> for the Visitor Pass Management System.</p>

      <div style="background-color: #eff6ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Login Credentials:</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> <code style="background-color: #dbeafe; padding: 5px 10px; border-radius: 3px;">${tempPassword}</code></p>
      </div>

      <p style="color: #dc2626;"><strong>Important:</strong> Please log in and change your password immediately after your first login.</p>

      <p style="margin-top: 30px;">Best regards,<br/>Visitor Pass System</p>
    </div>
  `;

  await sendPassEmail({
    to: email,
    subject: "Admin Invitation – Visitor Pass System",
    html
  });
};

createadmin.js

const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports = async function seedSuperAdmin() {
  try {
    const exists = await User.findOne({ role: "SUPER_ADMIN" });
    if (exists) {
      console.log("Super Admin already exists");
      return;
    }

    // Hash password BEFORE creating user
    const passwordHash = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD,
      10
    );

    await User.create({
      name: "System Owner",
      email: process.env.SUPER_ADMIN_EMAIL,
      password: passwordHash,
      role: "SUPER_ADMIN"
    });

    console.log("Super Admin Created Successfully");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
  }
};

email.js

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

qr.js

const QRCode = require("qrcode");

exports.generateQR = async (payload) => {
  try {
    
    const qrData = `${payload.passId}|${payload.qrToken}`;
    
    const qrImage = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: 'M',  // Medium error correction (25% recovery)
      type: 'image/png',           // PNG format
      quality: 0.92,               // High quality
      margin: 1,                   // Minimal margin (1 module)
      width: 300,                  // 300x300 pixels
      color: {
        dark: '#000000',           // Black QR code
        light: '#FFFFFF'           // White background
      }
    });
    
    // Log success and size
    const imageSizeKB = (qrImage.length * 0.75 / 1024).toFixed(2);
    return qrImage;
    
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};

exports.parseQR = (qrData) => {
  try {
    const [passId, qrToken] = qrData.split('|');
    
    if (!passId || !qrToken) {
      throw new Error('Invalid QR format');
    }
    
    return { passId, qrToken };
    
  } catch (error) {
    console.error("❌ QR parsing error:", error);
    throw new Error("Invalid QR code format");
  }
};

exports.isValidQRFormat = (qrData) => {
  if (!qrData || typeof qrData !== 'string') {
    return false;
  }
  
  const parts = qrData.split('|');
  
  if (parts.length !== 2) {
    return false;
  }
  
  const [passId, token] = parts;
  
  if (!passId || passId.length !== 24) {
    return false;
  }
  
  if (!token || token.length !== 36) {
    return false;
  }
  
  return true;
};

refundmail.js

const { sendPassEmail } = require("./email");

const refundInitiatedMail = async (bookerEmail, bookingId, refundAmount, passes) => {
  const passDetails = passes
    .map(p => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px;">${p.guest?.name || 'N/A'}</td>
        <td style="padding: 10px;">${p.place?.name || 'N/A'}</td>
        <td style="padding: 10px;">${new Date(p.visitDate).toDateString()}</td>
        <td style="padding: 10px;">Slot ${p.slotNumber || 'N/A'}</td>
        <td style="padding: 10px;">₹${p.refundAmount || 0}</td>
      </tr>
    `)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #f59e0b;">Refund Initiated</h2>
      <p>Dear Customer,</p>
      <p>Your refund request for Booking ID <strong>${bookingId}</strong> has been initiated.</p>
      
      <h3>Cancelled Passes:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left;">Guest</th>
            <th style="padding: 10px; text-align: left;">Place</th>
            <th style="padding: 10px; text-align: left;">Date</th>
            <th style="padding: 10px; text-align: left;">Slot</th>
            <th style="padding: 10px; text-align: left;">Refund</th>
          </tr>
        </thead>
        <tbody>
          ${passDetails}
        </tbody>
      </table>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Total Refund Amount:</strong> ₹${refundAmount}</p>
      </div>
      
      <p>The refund will be processed within 3-5 business days.</p>
      
      <p style="margin-top: 30px;">Best regards,<br/>Visitor Pass Management Team</p>
    </div>
  `;

  await sendPassEmail({ to: bookerEmail, subject: `Refund Initiated - Booking #${bookingId}`, html });
};

const refundCompletedMail = async (bookerEmail, bookingId, refundedAmount, passes) => {
  const passDetails = passes
    .map(p => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 10px;">${p.guest?.name || 'N/A'}</td>
        <td style="padding: 10px;">${p.place?.name || 'N/A'}</td>
        <td style="padding: 10px;">${new Date(p.visitDate).toDateString()}</td>
        <td style="padding: 10px;">₹${p.refundAmount || 0}</td>
      </tr>
    `)
    .join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #10b981;">Refund Completed</h2>
      <p>Dear Customer,</p>
      <p>Your refund for Booking ID <strong>${bookingId}</strong> has been successfully completed.</p>
      
      <h3>Refunded Passes:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left;">Guest</th>
            <th style="padding: 10px; text-align: left;">Place</th>
            <th style="padding: 10px; text-align: left;">Date</th>
            <th style="padding: 10px; text-align: left;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${passDetails}
        </tbody>
      </table>
      
      <div style="background-color: #d1fae5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0;"><strong>Total Refunded:</strong> ₹${refundedAmount}</p>
      </div>
      
      <p>Thank you for using our service.</p>
      
      <p style="margin-top: 30px;">Best regards,<br/>Visitor Pass Management Team</p>
    </div>
  `;

  await sendPassEmail({ to: bookerEmail, subject: `Refund Completed - Booking #${bookingId}`, html });
};

exports.eventCancellationRefundMail = async (email, data) => {
  const { bookingId, placeName, reason, refundAmount, passes } = data;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Event Cancelled - Full Refund Initiated - ${placeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">⚠️ Event Cancelled</h2>
        
        <p>We regret to inform you that the following event has been cancelled:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">${placeName}</h3>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
          <p><strong>Reason:</strong> ${reason}</p>
        </div>

        <h3>📝 Cancelled Passes:</h3>
        <ul>
          ${passes.map(p => `
            <li>
              <strong>${p.guestName}</strong> - ${p.visitDate}
              <br/>Refund: ₹${p.refundAmount}
            </li>
          `).join('')}
        </ul>

        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #155724; margin-top: 0;">💰 Full Refund Initiated</h3>
          <p style="margin: 0;">
            <strong>Refund Amount:</strong> ₹${refundAmount} (100% of booking amount)
            <br/><strong>Processing Time:</strong> 3-5 business days
            <br/><strong>Refund Method:</strong> Original payment method
          </p>
        </div>

        <p>We sincerely apologize for the inconvenience. Your refund is being processed and will be credited within 3-5 business days.</p>

        <p>If you have any questions, please contact our support team.</p>

        <p>Best regards,<br/>Event Management Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.hostEventCancelledMail = async (email, data) => {
  const { placeName, reason, totalRefunds, affectedVisitors, cancelledBy, date } = data;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Your Event Has Been Cancelled - ${placeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #e74c3c;">Event Cancelled</h2>
        
        <p>Your event <strong>${placeName}</strong> has been cancelled.</p>
        
        <div style="background: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Cancelled By:</strong> ${cancelledBy}</p>
          <p><strong>Date:</strong> ${date.toLocaleString()}</p>
          <p><strong>Reason:</strong> ${reason}</p>
        </div>

        <h3>Impact Summary:</h3>
        <ul>
          <li>Affected Visitors: ${affectedVisitors}</li>
          <li>Total Refunds: ₹${totalRefunds}</li>
          <li>Refund Percentage: 100%</li>
        </ul>

        <p>All affected visitors have been notified and will receive 100% refunds within 3-5 business days.</p>

        <p>Best regards,<br/>Event Management Team</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};
module.exports = { refundInitiatedMail, refundCompletedMail };

token.js

const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const generateSecurityToken = (security) => {
  return jwt.sign(
    {
      id: security._id,
      securityId: security._id,
      placeId: security.place,
      role: 'SECURITY'
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

module.exports = { generateToken, generateSecurityToken };

