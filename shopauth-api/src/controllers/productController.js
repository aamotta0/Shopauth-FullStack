const Product = require("../models/Product");
const AppError = require("../middlewares/AppError");

// ── OBTENER TODOS ────────────────────────────────────
// Público: cualquiera puede ver los productos
const getAllProducts = async (req, res, next) => {
  try {
    // Solo mostramos productos disponibles al público
    const products = await Product.find({ available: true })
      // populate() reemplaza el ID de createdBy con los datos del usuario
      // El segundo argumento 'name email' indica qué campos traer
      .populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// ── OBTENER UNO ──────────────────────────────────────
// Público
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!product) {
      return next(new AppError("Producto no encontrado", 404));
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ── CREAR ────────────────────────────────────────────
// Protegido: solo admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      // req.user viene del middleware protect
      // Guardamos el ID del admin que está creando el producto
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ── ACTUALIZAR ───────────────────────────────────────
// Protegido: solo admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, available } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, available },
      { new: true, runValidators: true },
    );

    if (!product) {
      return next(new AppError("Producto no encontrado", 404));
    }

    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// ── ELIMINAR ─────────────────────────────────────────
// Protegido: solo admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return next(new AppError("Producto no encontrado", 404));
    }

    res.status(200).json({
      success: true,
      message: `"${product.name}" eliminado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
