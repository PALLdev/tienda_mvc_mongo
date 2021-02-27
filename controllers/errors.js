exports.error404Page = (req, res, next) => {
  res.status(404).render("not-found", {
    docTitle: "No encontrado page",
    isAuthenticated: req.isLoggedIn,
  }); // si utilizo hbs paso layout: false, para no usar el default main-layout
};
