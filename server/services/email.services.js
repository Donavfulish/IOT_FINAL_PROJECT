import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendMail = async (subject, content, receiver) => {
  // 1. Tạo transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Cấu hình nội dung email
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: `${receiver}`,
    subject: `${subject}`,
    text: `${content}`,
  };

  // 3. Gửi email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
};
