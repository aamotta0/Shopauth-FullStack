require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./database");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
// middleware para parsear JSON
app.use(
  cors({
    origin: "http://localhost:5173", // URL donde correrá React
    credentials: true, // Permite enviar cookies y headers de auth
  }),
);

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ mensaje: "¡Bienvenido a ShopAuth API! 🛒" });
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// ⚠️ Siempre al final
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
