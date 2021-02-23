const Product = require("../models/product");

exports.getProductsPage = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("customers/products-list", {
        prods: products,
        docTitle: "Mis Productos",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDetailsPage = (req, res, next) => {
  // obtengo el id del producto desde la ruta
  const prodID = req.params.productId;
  Product.findById(prodID)
    .then((product) => {
      res.render("customers/product-details", {
        // when destructuring, then returns an array, so I get its first element that contains my single product data
        product: product,
        docTitle: `Detalles ${product.titulo}`,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getHomePage = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("customers/index", {
        docTitle: "Home Page Tienda Online",
        path: "/",
        prods: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCartPage = (req, res, next) => {
  req.user
    .getCart()
    .then((cartProds) => {
      res.render("customers/cart", {
        docTitle: "Pagina del carro",
        path: "/cart",
        products: cartProds,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddToCart = (req, res, next) => {
  const prodId = req.body.idProducto;

  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("Agregado al carro!");
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteCartItem = (req, res, next) => {
  const prodId = req.body.idCartItem;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrdersPage = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("customers/orders", {
        docTitle: "Pagina de tus pedidos",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getCheckoutPage = (req, res, next) => {
//   res.render("customers/checkout", {
//     docTitle: "Pagina de checkout",
//     path: "/checkout",
//   });
// };
