const { Router } = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const protect = require("../middlewares/protect");
const authorize = require("../middlewares/authorize");

const router = Router();

// ── Rutas públicas ────────────────────────────────────
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// ── Rutas protegidas (admin) ──────────────────────────
// protect  → verifica que el token sea válido
// authorize('admin') → verifica que el usuario sea admin
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);

module.exports = router;
