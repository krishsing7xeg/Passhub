const { sendPassEmail } = require("../services/email");

exports.sendSecurityInviteMail = async ({ to, tempPassword, placeName, acceptLink }) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #4f46e5;">🔐 Security Invitation</h2>

      <p>You have been invited to work as <strong>Security Personnel</strong> for:</p>
      <h3 style="color: #1f2937;">${placeName}</h3>

      <div style="background-color: #eff6ff; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h4 style="margin-top: 0;">Your Temporary Login Credentials:</h4>
        <p><strong>Email:</strong> ${to}</p>
        <p><strong>Temporary Password:</strong> <code style="background-color: #dbeafe; padding: 5px 10px; border-radius: 3px;">${tempPassword}</code></p>
      </div>

      <p>Please accept the invitation to activate your security access.</p>

      <a href="${acceptLink}"
         style="
           display: inline-block;
           margin-top: 15px;
           padding: 12px 24px;
           background-color: #4f46e5;
           color: #ffffff;
           text-decoration: none;
           border-radius: 5px;
           font-weight: bold;
         ">
        Accept Security Invitation
      </a>
      
      <p style="margin-top: 20px; color: #dc2626;"><strong>Important:</strong> Please change your password after your first login.</p>
      <p>This access is valid only for the event duration specified in your assignment.</p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
        If you did not expect this invitation, you can safely ignore this email.
      </p>
      
      <p style="margin-top: 20px;">Best regards,<br/>Visitor Pass Management Team</p>
    </div>
  `;

  await sendPassEmail({
    to,
    subject: `Security Invitation – ${placeName}`,
    html
  });
};