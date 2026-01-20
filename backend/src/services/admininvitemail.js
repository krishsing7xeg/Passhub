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