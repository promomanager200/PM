const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID_MAIL;
const CLEINT_SECRET = process.env.CLEINT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail({ promocode, code, email }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: `${process.env.SENDER_EMAIL}`,
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: `Promo Manager 🎉< ${process.env.SENDER_EMAIL}>`,
      to: `${process.env.ADMIN_EMAIL}`,
      subject: "A New Promo Code Submitted",
      text: `User Info
              email: ${email},
              code: ${code},
              promocode: ${promocode}`,
      html: `<html>
                <head>
                    <style>
                        .card{
                            display: grid;
                            align-items: center;
                            justify-content: center;
                            padding: 15px;
                            border: 5px solid black;
                            border-radius:10px;
                            font-size: 2rem;
                        }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2>New Promo Request</h2>
                        <p> email: ${email}</p>
                        <p> code: ${code}</p>
                        <p> promo: ${promocode}</p>
                    </div>
                </body>
            </html>`,
    };
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw error;
  }
}

exports.sendMail = sendMail;
