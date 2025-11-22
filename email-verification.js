// Add email verification to your backend
// Run this once to add the column to your database:
// ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
// ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
// ALTER TABLE users ADD COLUMN verification_token_expires TIMESTAMP;

const nodemailer = require('nodemailer');

// Configure your email service
// For Gmail, use an App Password: https://support.google.com/accounts/answer/185833
let transporter;

// For development/testing, if email credentials fail, use console logging
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD !== 'your-app-password-here') {
  try {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: (process.env.EMAIL_PASSWORD || '').replace(/\s/g, '')
      }
    });
  } catch (e) {
    console.error('Failed to create email transporter:', e.message);
    transporter = null;
  }
} else {
  transporter = null;
}

// Generate verification token
function generateVerificationToken() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Send verification email
async function sendVerificationEmail(email, token, baseUrl) {
  const verificationLink = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Direct Fit Automotive',
    html: `
      <h2>Welcome to Direct Fit Automotive!</h2>
      <p>Please verify your email to complete your registration.</p>
      <p>
        <a href="${verificationLink}" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </p>
      <p>Or copy this link: <a href="${verificationLink}">${verificationLink}</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create this account, please ignore this email.</p>
    `
  };
  
  // If transporter failed, log to console (for development)
  if (!transporter) {
    console.log('\n=== EMAIL WOULD BE SENT (Development Mode) ===');
    console.log('To:', email);
    console.log('Subject:', mailOptions.subject);
    console.log('Verification Link:', verificationLink);
    console.log('Token:', token);
    console.log('===\n');
    return Promise.resolve();
  }
  
  return transporter.sendMail(mailOptions);
}

// Send order confirmation email
async function sendOrderConfirmationEmail(email, name, orderId, items, total, vehicle, shippingAddress) {
  const itemsList = items.map(item => 
    `<tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}<br/><small style="color: #666;">Part #: ${item.partNumber}</small></td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.unitPrice || 0).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;"><strong>$${((item.unitPrice || 0) * item.quantity).toFixed(2)}</strong></td>
    </tr>`
  ).join('');

  const vehicleInfo = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'N/A';
  
  const addressHtml = shippingAddress ? `
    <p><strong>Shipping Address:</strong><br/>
    ${shippingAddress.streetAddress}<br/>
    ${shippingAddress.city}, ${shippingAddress.stateProvince} ${shippingAddress.postalCode}<br/>
    ${shippingAddress.country}</p>
  ` : '';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmation - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Thank You for Your Order!</h2>
        <p>Hi ${name},</p>
        <p>Your order has been confirmed and is being processed.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 5px 0;"><strong>Vehicle:</strong> ${vehicleInfo}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> <span style="font-size: 1.2em; color: #dc2626;">$${total.toFixed(2)}</span></p>
        </div>

        <h3>Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dc2626;">Item</th>
              <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dc2626;">Qty</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dc2626;">Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dc2626;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 15px 10px; text-align: right; font-size: 1.1em;"><strong>Order Total:</strong></td>
              <td style="padding: 15px 10px; text-align: right; font-size: 1.2em; color: #dc2626;"><strong>$${total.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>

        ${addressHtml}

        <div style="margin-top: 30px; padding: 15px; background-color: #fef2f2; border-left: 4px solid #dc2626;">
          <p style="margin: 0;"><strong>Payment Status:</strong> <span style="color: #16a34a;">✓ PAID</span></p>
          <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">A receipt from Stripe has also been sent to this email.</p>
        </div>

        <p style="margin-top: 30px;">If you have any questions about your order, please don't hesitate to contact us.</p>
        
        <p style="color: #666; font-size: 0.9em; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
          Thank you for choosing Direct Fit Automotive!
        </p>
      </div>
    `
  };
  
  // If transporter failed, log to console (for development)
  if (!transporter) {
    console.log('\n=== ORDER CONFIRMATION EMAIL (Development Mode) ===');
    console.log('To:', email);
    console.log('Subject:', mailOptions.subject);
    console.log('Order ID:', orderId);
    console.log('Total:', `$${total.toFixed(2)}`);
    console.log('===\n');
    return Promise.resolve();
  }
  
  return transporter.sendMail(mailOptions);
}

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
  sendOrderConfirmationEmail
};
