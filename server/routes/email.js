const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fueltrixteam@gmail.com',
    pass: 'eqnd bkeo iwqk egmh'
  }
});

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate request body
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: 'fueltrixteam@gmail.com',
    to: 'thisara.a2001@gmail.com',
    subject: `New Contact Form Submission: ${subject}`,
    text: `
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      Message: ${message}
    `,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PearlStay Contact Form Submission</title>
        <style>
          body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #e3e3e9; color: #333; }
          .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .header { background-color: #747293; color: #ffffff; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { padding: 30px; background-color: #e3e3e9; }
          .card { background-color: #ffffff; border: 1px solid #c7c7d4; border-radius: 6px; padding: 20px; margin-bottom: 20px; }
          .card p { margin: 10px 0; font-size: 16px; }
          .card p strong { color: #747293; }
          .card p span { color: #908ea9; }
          .footer { background-color: #acaabe; color: #ffffff; padding: 15px; text-align: center; font-size: 14px; }
          .footer a { color: #ffffff; text-decoration: underline; }
          @media only screen and (max-width: 600px) {
            .container { margin: 10px; }
            .header h1 { font-size: 20px; }
            .content { padding: 20px; }
            .card { padding: 15px; }
            .card p { font-size: 14px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>PearlStay Hotel Booking System</h1>
            <p style="margin: 5px 0; font-size: 14px;">New Contact Form Submission</p>
          </div>
          <div class="content">
            <div class="card">
              <p><strong>Name:</strong> <span>${name}</span></p>
              <p><strong>Email:</strong> <span>${email}</span></p>
              <p><strong>Subject:</strong> <span>${subject}</span></p>
              <p><strong>Message:</strong> <span>${message}</span></p>
            </div>
          </div>
          <div class="footer">
            <p>PearlStay Hotel Booking System</p>
            <p>123 Travel Street, Colombo, Sri Lanka | <a href="mailto:support@pearlstay.com">support@pearlstay.com</a> | +94 (765) 1234-123</p>
            <p>&copy; ${new Date().getFullYear()} PearlStay. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;