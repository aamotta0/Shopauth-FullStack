const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },

    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      enum: {
        values: [
          "Electrónica",
          "Ropa",
          "Hogar",
          "Deportes",
          "Alimentación",
          "Otro",
        ],
        message: "Categoría no válida",
      },
    },

    stock: {
      type: Number,
      required: [true, "El stock es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },

    available: {
      type: Boolean,
      default: true,
    },

    // Referencia al usuario que creó el producto
    // Esto es una RELACIÓN entre colecciones en MongoDB
    // En lugar de guardar todos los datos del usuario,
    // guardamos solo su ID y luego podemos "poblarlo"
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Tipo especial para IDs de MongoDB
      ref: "User", // Hace referencia al modelo 'User'
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
