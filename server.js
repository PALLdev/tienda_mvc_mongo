const path = require("path");
const express = require("express");
const parser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorsController = require("./controllers/errors");
const User = require("./models/user");
const dbURL = require("./util/database");

const app = express();
const port = 3000;

app.set("view engine", "ejs"); // definiendo el template engine
app.set("views", "views"); // definiendo donde estan mis views

app.use(parser.urlencoded({ extended: false }));
// dando acceso a mi carpeta public (read only)
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret:
      "esta es una frase larga que firmara mi hash que guarda mi session id cookie",
    resave: false,
    saveUninitialized: false,
  })
);

// PASANDO USER AL REQUEST (user creado manualmente)
app.use((req, res, next) => {
  User.findById("6036e0cd2ea0191a6c670fe5")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.error404Page);

mongoose
  .connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // findOne with no arguments devuelve el primero que obtenga (el unico user en este caso)
    User.findOne().then((user) => {
      if (!user) {
        const u = new User({
          nombre: "admin",
          email: "admin@test.com",
          carro: { items: [] },
        });
        u.save();
      }
    });
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
