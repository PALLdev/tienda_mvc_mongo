const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  productos: [
    {
      producto: {
        type: Object,
        required: true,
      },
      cantidad: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    nombre: {
      type: String,
      required: true,
    },
  },
  fecha: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const Order = mongoose.model("Pedido", orderSchema);

module.exports = Order;
