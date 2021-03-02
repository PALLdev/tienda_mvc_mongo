const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/signup");
      }
      return bcrypt
        .compare(password, user.contraseña)
        .then((validPassword) => {
          // if passwords are equal (return true)
          if (validPassword) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save((err) => {
              res.redirect("/");
            });
          }
          res.redirect("/signup");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/signup");
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
      // si no existe un user con ese email, hasheo el pass para el new user
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            nombre: name,
            email: email,
            contraseña: hashedPassword,
            carro: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/signup");
          console.log("registrado, logeate!");
        });
    })

    .catch((err) => {
      console.log(err);
    });
};
