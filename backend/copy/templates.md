below are the template files
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

securityinvitemail.md

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

subscriptionrelatedmail.js

const SubscriptionPlan = require("../models/subscriptionplan");
const User = require("../models/user");
const { sendPassEmail } = require("../services/email");

exports.purchaseSubscription = async (req, res) => {
  try {
    const { planId, startDate } = req.body;
    const userId = req.user.id;

    console.log('📦 Subscription purchase request:', { userId, planId, startDate });

    // Validate plan
    const plan = await SubscriptionPlan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or inactive plan" 
      });
    }

    // Calculate subscription dates
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + plan.durationDays);

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update user subscription
    user.subscription.planId = plan._id;
    user.subscription.isActive = plan.price === 0; // Activate immediately for free plans
    user.subscription.startDate = start;
    user.subscription.endDate = end;
    user.subscription.amountPaid = plan.price;
    user.subscription.paymentStatus = plan.price === 0 ? "FREE" : "PENDING";
    
    await user.save();

    console.log('✅ Subscription updated in database');

    // ✅ FREE PLAN - Activate immediately and send confirmation
    if (plan.price === 0) {
      console.log('📧 Sending free subscription confirmation email...');
      
      if (user.email) {
        try {
          await sendPassEmail({
            to: user.email,
            subject: "Free Subscription Activated - PassHub",
            html: subscriptionConfirmationTemplate({
              userName: user.name,
              planName: plan.name,
              startDate: start,
              endDate: end,
              price: 0,
              daysRemaining: plan.durationDays
            })
          });
          console.log(`✅ Free subscription email sent to: ${user.email}`);
        } catch (emailError) {
          console.error(`❌ Failed to send subscription email:`, emailError);
        }
      }

      return res.json({
        success: true,
        message: "Free subscription activated successfully",
        subscription: {
          planName: plan.name,
          startDate: start,
          endDate: end,
          isActive: true,
          daysRemaining: plan.durationDays
        }
      });
    }

    // ✅ PAID PLAN - Send payment pending email
    console.log('📧 Sending payment pending email...');
    
    if (user.email) {
      try {
        await sendPassEmail({
          to: user.email,
          subject: "Complete Your Subscription Payment - PassHub",
          html: subscriptionPendingTemplate({
            userName: user.name,
            planName: plan.name,
            price: plan.price,
            durationDays: plan.durationDays
          })
        });
        console.log(`✅ Payment pending email sent to: ${user.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send payment email:`, emailError);
      }
    }

    res.json({
      success: true,
      message: "Proceed to payment",
      subscription: {
        planName: plan.name,
        amountToPay: plan.price,
        startDate: start,
        endDate: end,
        isActive: false,
        paymentPending: true
      },
      amountToPay: plan.price
    });
    
  } catch (error) {
    console.error('❌ Subscription purchase error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.confirmSubscriptionPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { transactionId } = req.body;

    console.log('💳 Payment confirmation request:', { userId, transactionId });

    const user = await User.findById(userId).populate('subscription.planId');
    
    if (!user || !user.subscription || !user.subscription.planId) {
      return res.status(404).json({
        success: false,
        message: "No pending subscription found"
      });
    }

    if (user.subscription.paymentStatus === 'PAID') {
      return res.status(400).json({
        success: false,
        message: "Subscription already paid and active"
      });
    }

    // Activate subscription
    user.subscription.isActive = true;
    user.subscription.paymentStatus = 'PAID';
    await user.save();

    console.log('✅ Subscription activated');

    // Calculate days remaining
    const now = new Date();
    const endDate = new Date(user.subscription.endDate);
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    // Send confirmation email
    if (user.email) {
      try {
        await sendPassEmail({
          to: user.email,
          subject: "Subscription Payment Confirmed - PassHub",
          html: subscriptionConfirmationTemplate({
            userName: user.name,
            planName: user.subscription.planId.name,
            startDate: user.subscription.startDate,
            endDate: user.subscription.endDate,
            price: user.subscription.amountPaid,
            daysRemaining: daysRemaining,
            transactionId: transactionId
          })
        });
        console.log(`✅ Subscription confirmation email sent to: ${user.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send confirmation email:`, emailError);
      }
    }

    res.json({
      success: true,
      message: "Subscription activated successfully",
      subscription: {
        planName: user.subscription.planId.name,
        startDate: user.subscription.startDate,
        endDate: user.subscription.endDate,
        isActive: true,
        daysRemaining: daysRemaining,
        transactionId: transactionId
      }
    });
    
  } catch (error) {
    console.error('❌ Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const subscriptionConfirmationTemplate = ({ userName, planName, startDate, endDate, price, daysRemaining, transactionId }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Confirmed</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🎉 Subscription Activated!</h1>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 15px 0; color: #1f2937;">Hello ${userName}! 👋</h2>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    Your <strong>${planName}</strong> subscription has been successfully activated. You can now start hosting events on PassHub!
                  </p>

                  <!-- Subscription Details -->
                  <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #065f46; font-weight: bold; margin-bottom: 10px;">📋 Subscription Details:</p>
                    <table width="100%" cellpadding="5" cellspacing="0">
                      <tr>
                        <td style="color: #047857;"><strong>Plan:</strong></td>
                        <td style="color: #065f46; text-align: right;">${planName}</td>
                      </tr>
                      <tr>
                        <td style="color: #047857;"><strong>Start Date:</strong></td>
                        <td style="color: #065f46; text-align: right;">${new Date(startDate).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td style="color: #047857;"><strong>End Date:</strong></td>
                        <td style="color: #065f46; text-align: right;">${new Date(endDate).toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td style="color: #047857;"><strong>Days Remaining:</strong></td>
                        <td style="color: #065f46; text-align: right;">${daysRemaining} days</td>
                      </tr>
                      <tr>
                        <td style="color: #047857;"><strong>Amount Paid:</strong></td>
                        <td style="color: #065f46; text-align: right; font-size: 18px; font-weight: bold;">
                          ${price === 0 ? 'FREE' : `₹${price}`}
                        </td>
                      </tr>
                      ${transactionId ? `
                      <tr>
                        <td style="color: #047857;"><strong>Transaction ID:</strong></td>
                        <td style="color: #065f46; text-align: right; font-family: monospace; font-size: 12px;">${transactionId}</td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>

                  <!-- What's Next -->
                  <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0; color: #1e40af; font-weight: bold; margin-bottom: 10px;">🚀 What's Next?</p>
                    <ul style="margin: 10px 0; padding-left: 20px; color: #1e3a8a;">
                      <li style="margin-bottom: 8px;">Create your first event from the dashboard</li>
                      <li style="margin-bottom: 8px;">Set up event details and pricing</li>
                      <li style="margin-bottom: 8px;">Invite security personnel</li>
                      <li style="margin-bottom: 8px;">Start accepting bookings!</li>
                    </ul>
                  </div>

                  <p style="margin: 20px 0 0 0; color: #4b5563; font-size: 14px;">
                    Thank you for choosing PassHub. We're excited to see your events come to life!
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    Need help? Contact us at <a href="mailto:support@passhub.com" style="color: #3b82f6; text-decoration: none;">support@passhub.com</a>
                  </p>
                  <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                    © 2026 PassHub. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};


const subscriptionPendingTemplate = ({ userName, planName, price, durationDays }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Complete Your Payment</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
              
              <tr>
                <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">⏳ Payment Pending</h1>
                </td>
              </tr>

              <tr>
                <td style="padding: 40px;">
                  <h2 style="margin: 0 0 15px 0; color: #1f2937;">Hello ${userName}!</h2>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px;">
                    You've selected the <strong>${planName}</strong> subscription. Please complete the payment to activate your hosting privileges.
                  </p>

                  <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <table width="100%" cellpadding="5">
                      <tr>
                        <td style="color: #92400e;"><strong>Plan:</strong></td>
                        <td style="color: #78350f; text-align: right;">${planName}</td>
                      </tr>
                      <tr>
                        <td style="color: #92400e;"><strong>Duration:</strong></td>
                        <td style="color: #78350f; text-align: right;">${durationDays} days</td>
                      </tr>
                      <tr>
                        <td style="color: #92400e;"><strong>Amount:</strong></td>
                        <td style="color: #78350f; text-align: right; font-size: 20px; font-weight: bold;">₹${price}</td>
                      </tr>
                    </table>
                  </div>

                  <div style="background-color: #fee2e2; padding: 15px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 0; color: #991b1b; font-weight: bold;">⚠️ Action Required:</p>
                    <p style="margin: 10px 0 0 0; color: #7f1d1d;">Please complete the payment within 24 hours to activate your subscription.</p>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    Questions? Contact <a href="mailto:support@passhub.com" style="color: #3b82f6;">support@passhub.com</a>
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};