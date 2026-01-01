const nodemail = require("nodemailer");
const { emailUser, emailPass } = require("../config/keys");

const sendEmail = async ({ emailTo, subject, code, content }) => {
  const transporter = nodemail.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: String(emailUser),
      pass: String(emailPass),
    },
  });
  const message = {
    to: emailTo,
    subject,
    html: `
                <div>
                    <h3>Use this below code to ${content}</h3>
                    <h2>Your verification code is: ${code}</h2>
                </div>
        `,
  };
  await transporter.sendMail(message);
};

module.exports = sendEmail;
