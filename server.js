const path = require("path");
const express = require("express");
const parser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorsController = require("./controllers/errors");
const User = require("./models/user");
const MONGODB_URI = require("./util/database");
const csrf = require("csurf");

const app = express();
const port = 3000;
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sesiones",
});

const csrfProtection = csrf();

app.set("view engine", "ejs"); // definiendo el template engine
app.set("views", "views"); // definiendo donde estan mis views (redundant)

app.use(parser.urlencoded({ extended: false }));
// dando acceso a mi carpeta public (read only)
app.use(express.static(path.join(__dirname, "public")));

// data stored in session = data that persist across requests
app.use(
  session({
    secret:
      "esta es una frase larga que firmara mi hash que guarda mi session id cookie",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// after the session is initialized bc csurf uses it
app.use(csrfProtection);

// using session data to create mongoose user model y pasarselo al request
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  // set local variables that are passed into the views
  // for every request executed these fields will be set for the view rendered
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorsController.error404Page);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
