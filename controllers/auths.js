const User = require("../models/user");

exports.getLoginPage = (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Pagina de login",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("6036e0cd2ea0191a6c670fe5")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      // ensuring that your session has been created
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// borra la sesion en la db
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getRegistroPage = (req, res, next) => {
  res.render("auth/sign-up", {
    docTitle: "Pagina de Registro",
    path: "/signup",
    isAuthenticated: false,
  });
};

exports.postRegistro = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      // si no existe un user con ese email, creo un nuevo user
      const user = new User({
        nombre: name,
        email: email,
        contraseña: password,
        carro: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
