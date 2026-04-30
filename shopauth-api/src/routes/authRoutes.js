const { Router } = require("express");
const { register, login, getMe } = require("../controllers/authController");
const protect = require("../middlewares/protect");

const router = Router();

// Rutas públicas (no requieren token)
router.post("/register", register);
router.post("/login", login);

// Ruta protegida → protect se ejecuta ANTES de getMe
// Si el token no es válido, protect detiene todo y nunca llega a getMe
router.get("/me", protect, getMe);

module.exports = router;

/* 📒 Conceptos clave:
En Express puedes encadenar middlewares en una ruta así:
javascriptrouter.get('/ruta', middleware1, middleware2, controlador)
Se ejecutan de izquierda a derecha. Si alguno llama next(error), los siguientes se saltan.
*/
