const Product = require("../models/product");

exports.getAdminProductsPage = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("admin/products", {
        docTitle: "Administrar productos",
        path: "/admin/products",
        prods: products,
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
  });
};

exports.postAddProduct = (req, res, next) => {
  // los obtengo con el name HTML
  const title = req.body.titulo;
  const imgURL = req.body.urlImagen;
  const price = req.body.precio;
  const description = req.body.descripcion;

  const product = new Product(
    null,
    title,
    price,
    description,
    imgURL,
    req.user._id
  );
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
    // Product.findByPk(prodId)
    .then((product) => {
      // const product = products[0];
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

  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImgUrl,
    req.user._id
  );

  updatedProduct
    .save()
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
  Product.deleteById(prodId)
    .then(() => {
      req.user.deleteItemFromCart(prodId);
      console.log("Producto borrado exitosamente!!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
