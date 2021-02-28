exports.error404Page = (req, res, next) => {
  res.status(404).render("not-found", {
    docTitle: "No encontrado page",
    isAuthenticated: req.session.isLoggedIn,
  }); // si utilizo hbs paso layout: false, para no usar el default main-layout
};
