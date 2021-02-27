const Product = require("../models/product");

exports.getAdminProductsPage = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        docTitle: "Administrar productos",
        path: "/admin/products",
        prods: products,
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Formulario",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: req.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  // los obtengo con el name HTML
  const title = req.body.titulo;
  const imgURL = req.body.urlImagen;
  const price = req.body.precio;
  const description = req.body.descripcion;

  const product = new Product({
    titulo: title,
    precio: price,
    descripcion: description,
    urlImagen: imgURL,
    userId: req.user, // en mongoose puedo mandar el user object y guardara el valor del id en la variable (req.user._id)
  });

  product
    .save()
    .then(() => {
      console.log("Producto agregado a la BD!!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProductPage = (req, res, next) => {
  const editMode = req.query.edit;
  // redundant if check ya que siempre que entre aqui sera en edit mode
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        // si no encuentro el producto redirecciono, aunque deberia mostrar un mensaje de error
        return res.redirect("/");
      }
      // si encuentro el producto lo mando al view
      res.render("admin/edit-product", {
        docTitle: "Editar producto",
        path: "/admin/edit-product",
        editing: true,
        product: product,
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.titulo;
  const updatedImgUrl = req.body.urlImagen;
  const updatedPrice = req.body.precio;
  const updatedDescription = req.body.descripcion;

  Product.findById(prodId)
    .then((product) => {
      product.titulo = updatedTitle;
      product.precio = updatedPrice;
      product.descripcion = updatedDescription;
      product.urlImagen = updatedImgUrl;
      product.userId = req.user;
      return product.save();
    })
    .then(() => {
      console.log("Producto actualizado exitosamente!!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.idProducto;
  Product.findByIdAndDelete(prodId)
    .then(() => {
      return req.user.deleteFromCart(prodId);
    })
    .then(() => {
      console.log("Producto borrado exitosamente!!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
