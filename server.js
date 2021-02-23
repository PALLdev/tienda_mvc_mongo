const path = require("path");
const express = require("express");
const parser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorsController = require("./controllers/errors");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

const app = express();
const port = 3000;

app.set("view engine", "ejs"); // definiendo el template engine
app.set("views", "views"); // definiendo donde estan mis views

app.use(parser.urlencoded({ extended: false }));
// dando acceso a mi carpeta public (read only)
app.use(express.static(path.join(__dirname, "public")));

// PASANDO USER AL REQUEST (user creado manualmente)
app.use((req, res, next) => {
  // lo paso como string ya que el argument id viene como ObjectId desde el model
  User.findById("6033a211ed1f2f11b78117be")
    .then((user) => {
      req.user = new User(user.nombre, user.email, user.carro, user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorsController.error404Page);

mongoConnect(() => {
  app.listen(port);
});
