const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  urlImagen: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

const Product = mongoose.model("Producto", productSchema);

module.exports = Product;

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// const ObjectId = mongodb.ObjectId;

// class Product {
//   constructor(id, titulo, precio, descripcion, urlImagen, userId) {
//     this._id = id ? new ObjectId(id) : null;
//     this.titulo = titulo;
//     this.precio = precio;
//     this.descripcion = descripcion;
//     this.urlImagen = urlImagen;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOperation;

//     if (this._id) {
//       // si al guardar existe, es un update
//       dbOperation = db
//         .collection("productos")
//         // as a second argument, we describe the changes we wanna make to the existing object found with the _id (en este caso reemplazo el mismo objeto con valores nuevos)
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // si no existe en un insert
//       dbOperation = db.collection("productos").insertOne(this);
//     }
//     return dbOperation
//       .then((result) => {
//         console.log("Enviado a la db!");
//       })
//       .catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("productos")
//       .find()
//       .toArray()
//       .then((products) => {
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(productId) {
//     const db = getDb();
//     return db
//       .collection("productos")
//       .find({ _id: new ObjectId(productId) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static deleteById(productId) {
//     const db = getDb();
//     return db
//       .collection("productos")
//       .deleteOne({ _id: new ObjectId(productId) })
//       .then((result) => {
//         console.log("Producto borrado de la BD!");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = Product;
