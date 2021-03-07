const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID_MAIL;
const client = new OAuth2Client(CLIENT_ID);
const { getDb } = require("../util/db");
const { sendMail } = require("../middleware/sendMail");

// HOME : GET
exports.getHome = (req, res, next) => {
  if (req.cookies["session-token"]) {
    res.clearCookie("session-token");
    //res.redirect('/promo')
  }
  res.render("index", {
    errorMessage: null,
  });
};

//LOGIN : POST
exports.postLogin = (req, res) => {
  const token = req.body.token;
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
  }
  verify()
    .then(() => {
      res.cookie("session-token", token);
      res.status(200).send("success");
    })
    .catch((err) =>
      res.render("index", {
        errorMessage:
          "Oh no, sorry but your google login failed. Please try again",
      })
    );
};

// PROMO : GET
exports.getPromo = (req, res) => {
  const db = getDb();
  db.collection("users")
    .find({ email: req.user.email })
    .next()
    .then((user) => {
      res.render("promo", {
        email: user.email,
        code: user.code,
        flasherror: req.flash("error"),
        error: null,
      });
    })
    .catch((err) => {
      res.render("promo", {
        email: req.user.email,
        code: null,
        flasherror: null,
        error: "❌ Sorry, You weren't on the list, no sneaking in!",
      });
    });
};

// PROMO : POST
exports.postPromo = (req, res) => {
  const info = { ...req.body };
  sendMail(info)
    .then((result) => {
      return res.redirect("/success");
    })
    .catch((err) => {
      req.flash("error", "❌ Process Failed. Try again");
      return res.redirect("/promo");
    });
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("session-token");
  res.redirect("/");
};

// SUCCESS : GET
exports.success = (req, res) => {
  res.render("success");
};
