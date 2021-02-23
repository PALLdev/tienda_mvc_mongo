exports.error404Page = (req, res, next) => {
    res.status(404).render('not-found', { docTitle: 'No encontrado page' }); // si utilizo hbs paso layout: false, para no usar el default main-layout
};