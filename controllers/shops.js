const Product = require("../models/product");
const Order = require("../models/order");

exports.getProductsPage = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("customers/products-list", {
        prods: products,
        docTitle: "Mis Productos",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
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
        product: product,
        docTitle: `Detalles ${product.titulo}`,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getHomePage = (req, res, next) => {
  Product.find()
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
  // console.log(req.user);
  req.user
    .populate("carro.items.productId") // agregando todo el producto al user object
    .execPopulate()
    .then((user) => {
      const cartProds = user.carro.items;
      res.render("customers/cart", {
        docTitle: "Pagina del carro",
        path: "/cart",
        products: cartProds,
        isAuthenticated: req.session.isLoggedIn,
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
    .deleteFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrdersPage = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("customers/orders", {
        docTitle: "Pagina de tus pedidos",
        path: "/orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postAddOrder = (req, res, next) => {
  req.user
    .populate("carro.items.productId") // agregando todo el producto al user object
    .execPopulate()
    .then((user) => {
      const cartProducts = user.carro.items.map((item) => {
        return {
          cantidad: item.cantidad,
          producto: { ...item.productId._doc }, // retorna toda la info del producto
        };
      });

      const order = new Order({
        productos: cartProducts,
        user: {
          userId: req.user,
          nombre: req.user.nombre,
        },
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
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
