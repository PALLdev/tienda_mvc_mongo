exports.getLoginPage = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  // const isLoggedIn = req.get("Cookie").trim().split("=")[1] === "true";
  res.render("auth/login", {
    docTitle: "Pagina de login",
    path: "/login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
  req.session.isLoggedIn = true;
  res.redirect("/");
};
