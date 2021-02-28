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
