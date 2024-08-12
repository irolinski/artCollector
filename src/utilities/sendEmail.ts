const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_KEY,
  },
});

async function sendEmail(
  userEmail: string,
  subject: string,
  emailBody: string
) {
  const info = await transporter
    .sendMail({
      from: `"artCollector Team" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      text: emailBody,
    })
    .catch(console.error);
  return info ? info.messageID : null;
}

export default sendEmail;
