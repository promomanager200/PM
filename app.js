require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const { mongoConnect } = require("./util/db");
const app = express();

//controllers and custom middleware
const { checkAuthenticated } = require("./middleware");
const {
  getHome,
  postLogin,
  getPromo,
  logout,
  postPromo,
  success,
} = require("./controller");
const users = [{ email: "dhanush.code1@gmail.com", code: 123 }];

const PORT = process.env.PORT || 3000;

//Middleware and config
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "promotions",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

//Routes
app.get("/", getHome);
app.get("/promo", checkAuthenticated, getPromo);
app.get("/logout", checkAuthenticated, logout);
app.get("/success", checkAuthenticated, success);
app.post("/login", postLogin);
app.post("/promo", checkAuthenticated, postPromo);

//Not Found Route
app.use((req, res) => {
  res.render("404");
});

//Server
mongoConnect(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
