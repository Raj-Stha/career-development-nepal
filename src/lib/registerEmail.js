import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // convert string to boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Register - company email" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email - company email",
    html: `
      <div style="font-family: sans-serif; line-height: 1.5">
        <p>Hello,</p>
        <p>Your verification code is:</p>
        <h2 style="color: #4caf50;">${code}</h2>
        <p>This code will expire in 3 minutes.</p>
      </div>
    `,
  });
};


export const sendPasswordResetVerificationEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Password Reset - Company Email" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset Your Password - Company Email",
    html: `
      <div style="font-family: sans-serif; line-height: 1.5">
        <p>Hello,</p>
        <p>We received a request to reset your password. Use the code below to proceed:</p>
        <h2 style="color: #4caf50;">${code}</h2>
        <p>This code is valid for 3 minutes. If you didn't request this, you can safely ignore this email.</p>
        <p>Thank you,<br/>The Company Team</p>
      </div>
    `,
  });
};
