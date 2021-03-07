const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = process.env.CLIENT_ID_MAIL;
const client = new OAuth2Client(CLIENT_ID);

function checkAuthenticated(req, res, next) {
  let token = req.cookies["session-token"];

  let user = {};
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
  }
  verify()
    .then(() => {
      req.user = user;
      next();
    })
    .catch((err) => {
      res.redirect("/");
    });
}

module.exports = {
  checkAuthenticated,
};
