exports.passEmailTemplate = ({ guest, place, visitDate, passes }) => {
  const formattedDate = new Date(visitDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  let guestCardsHTML = passes.map(p => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td colspan="2" style="padding: 20px;">
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
          <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 16px; color: #1f2937;">${p.guest.name}</p>
          ${p.guest.email ? `<p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">📧 ${p.guest.email}</p>` : ""}
          ${p.guest.phone ? `<p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">📱 ${p.guest.phone}</p>` : ""}
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0; text-align: center;">
            ${p.qrImage ? `
              <img src="${p.qrImage}" alt="QR Code" style="width: 200px; height: 200px; display: block; margin: 0 auto 10px auto; border: 2px solid #e5e7eb; border-radius: 8px;" />
              <p style="margin: 5px 0; color: #4f46e5; font-weight: bold; font-size: 16px;">Slot #${p.slotNumber || "TBD"}</p>
              <p style="margin: 5px 0; font-size: 12px; color: #6b7280;">Scan this QR code at entry</p>
            ` : '<p style="color: #dc2626; font-weight: bold;">QR Code Pending</p>'}
          </div>
          
          <div style="margin-top: 10px; padding: 10px; background: ${p.status === 'APPROVED' ? '#d1fae5' : '#fef3c7'}; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; color: ${p.status === 'APPROVED' ? '#065f46' : '#92400e'};">
              <strong>Status:</strong> ${p.status}
            </p>
          </div>
        </div>
      </td>
    </tr>
  `).join("");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your PassHub Booking</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
    <table style="max-width: 600px; width: 100%; margin: 20px auto; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <tr>
        <td colspan="2" style="padding: 30px; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);">
          <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🎫 Your PassHub Booking</h1>
          <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Event Pass Confirmation</p>
        </td>
      </tr>
      
      <!-- Greeting -->
      <tr>
        <td colspan="2" style="padding: 30px 30px 20px 30px;">
          <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 20px;">Hello ${guest.name}! 👋</h2>
          <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
            Your booking for <strong>${place.name}</strong> on <strong>${formattedDate}</strong> is confirmed!
          </p>
        </td>
      </tr>

      <!-- Event Details -->
      <tr>
        <td colspan="2" style="padding: 0 30px 20px 30px;">
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%); padding: 20px; border-radius: 8px; border-left: 4px solid #6366f1;">
            <h3 style="margin: 0 0 15px 0; color: #4f46e5; font-size: 16px;">📍 Event Details</h3>
            <table width="100%" cellpadding="5" cellspacing="0">
              <tr>
                <td style="color: #6b7280; font-size: 14px; width: 40%;"><strong>Event:</strong></td>
                <td style="color: #1f2937; font-size: 14px; text-align: right;">${place.name}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px;"><strong>Location:</strong></td>
                <td style="color: #1f2937; font-size: 14px; text-align: right;">${place.location}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px;"><strong>Date:</strong></td>
                <td style="color: #1f2937; font-size: 14px; text-align: right;">${formattedDate}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px;"><strong>Total Guests:</strong></td>
                <td style="color: #1f2937; font-size: 14px; text-align: right;">${passes.length}</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>

      <!-- Guest Passes with QR Codes -->
      <tr>
        <td colspan="2" style="padding: 0 30px 10px 30px;">
          <h3 style="margin: 0; color: #1f2937; font-size: 18px;">Your Pass${passes.length > 1 ? 'es' : ''}</h3>
        </td>
      </tr>
      ${guestCardsHTML}

      <!-- Important Notice -->
      <tr>
        <td colspan="2" style="padding: 20px 30px;">
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
              <strong>⚠️ Important:</strong> Please show the QR code at the venue for entry. 
              Save this email or take a screenshot of your QR code. Each QR code is unique and can only be used once.
            </p>
          </div>
        </td>
      </tr>

      <!-- Tips Section -->
      <tr>
        <td colspan="2" style="padding: 0 30px 20px 30px;">
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: bold; font-size: 14px;">💡 Tips for Entry:</p>
            <ul style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 13px; line-height: 1.8;">
              <li>Arrive 15 minutes before the event starts</li>
              <li>Keep your QR code ready on your phone or printed</li>
              <li>Carry a valid photo ID</li>
              <li>Follow the event guidelines and enjoy!</li>
            </ul>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td colspan="2" style="padding: 20px 30px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
            Thank you for booking with PassHub!
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            Need help? Contact us at <a href="mailto:support@passhub.com" style="color: #6366f1; text-decoration: none;">support@passhub.com</a>
          </p>
          <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
            © 2026 PassHub. All rights reserved.
          </p>
        </td>
      </tr>

    </table>
  </body>
  </html>
  `;
};