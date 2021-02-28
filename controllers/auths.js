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
