const mongoose = require("mongoose");
const Product = require("./product");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  carro: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },
        cantidad: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  // check if item exists in our cart by index
  const cartProductIndex = this.carro.items.findIndex((cartProd) => {
    return cartProd.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.carro.items];

  // si existe modifico su cantidad
  if (cartProductIndex >= 0) {
    newQuantity = this.carro.items[cartProductIndex].cantidad + 1;
    updatedCartItems[cartProductIndex].cantidad = newQuantity;
  } else {
    // si no existe lo agrego
    updatedCartItems.push({
      productId: product._id,
      cantidad: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.carro = updatedCart;
  return this.save();
};

// creo una nueva lista sin el producto que quiero borrar
userSchema.methods.deleteFromCart = function (productId) {
  const updatedCartItems = this.carro.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });

  userSchema.methods.addOrder = function () {};

  this.carro.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.carro = { items: [] };
  return this.save();
};

const User = mongoose.model("Usuario", userSchema);
module.exports = User;

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(nombreUsuario, email, carro, id) {
//     this.nombre = nombreUsuario;
//     this.email = email;
//     this.carro = carro; // {items: []}
//     this._id = id;
//   }

//   addToCart(product) {
//     // check if item exists in our cart by index
//     const cartProductIndex = this.carro.items.findIndex((cartProd) => {
//       return cartProd.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.carro.items];

//     // si existe modifico su cantidad
//     if (cartProductIndex >= 0) {
//       newQuantity = this.carro.items[cartProductIndex].cantidad + 1;
//       updatedCartItems[cartProductIndex].cantidad = newQuantity;
//     } else {
//       // si no existe lo agrego
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         cantidad: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection("usuarios")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { carro: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     // getting a list of ids of products in the cart
//     const productIds = this.carro.items.map((item) => {
//       return item.productId;
//     });
//     // fetch all products where the _id is part of my list of ids, returns a cursor with the matching products
//     return db
//       .collection("productos")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((prod) => {
//           // return new object with all product properties and add a quantity property
//           return {
//             ...prod,
//             // to get the right quantity access the user cart items
//             cantidad: this.carro.items.find((item) => {
//               // get product qty where the cart item _id matches the _id of the product fetched from the db
//               return item.productId.toString() === prod._id.toString();
//             }).cantidad,
//           };
//         });
//       });
//   }

//
//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.carro.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     return db
//       .collection("usuarios")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { carro: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((productsData) => {
//         // en este caso no hay problema al duplicar datos ya que si el pedido ya fue procesado, no importara que el user haga cambios en sus datos
//         const order = {
//           items: productsData,
//           user: {
//             _id: new ObjectId(this._id),
//             nombre: this.nombre,
//           },
//         };
//         return db.collection("pedidos").insertOne(order);
//       })
//       .then((result) => {
//         //clear cart in the user object
//         this.carro = { items: [] };
//         // clear cart in the db
//         return db
//           .collection("usuarios")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { carro: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("pedidos")
//       .find({ "user._id": new ObjectId(this._id) }) // checking nested properties with the path
//       .toArray();
//   }

//   save() {
//     const db = getDb();

//     return db
//       .collection("usuarios")
//       .insertOne(this)
//       .then((result) => {
//         console.log("Usuario agregado a la BD!");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(userId) {
//     const db = getDb();

//     return db
//       .collection("usuarios")
//       .find({ _id: new ObjectId(userId) })
//       .next()
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
