const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmail = async (subject, message) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.ADMIN_EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Make sure we have a recipient
    if (!process.env.ADMIN_EMAIL) {
      throw new Error("Admin email not defined in environment variables");
    }

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: process.env.ADMIN_EMAIL, 
      subject: subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Rethrow the error so the calling function knows something went wrong
    throw error;
  }
};

module.exports = sendEmail;