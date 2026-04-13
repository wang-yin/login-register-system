import nodemailer from 'nodemailer';

export const sendEmail = async (options: {
  email: string;
  subject: string;
  html: string;
}) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log('帳號:', process.env.EMAIL_USER);
  console.log('密碼存在嗎:', !!process.env.EMAIL_PASS);

  const mailOptions = {
    from: `Login System <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};
