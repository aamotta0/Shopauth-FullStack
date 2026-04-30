const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("./AppError");

const protect = async (req, res, next) => {
  try {
    // ── 1. Verificar que el token existe ──────────────────
    // Los tokens se envían en el header "Authorization"
    // con el formato: "Bearer eyJhbGciOiJIUzI1NiJ9..."
    // "Bearer" es un estándar que significa "portador del token"
    const authHeader = req.headers.authorization;

    let token;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Separamos "Bearer " del token real
      // "Bearer eyJhbG..." → ["Bearer", "eyJhbG..."]
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(
          "No has iniciado sesión. Por favor inicia sesión para acceder",
          401,
        ),
      );
    }

    // ── 2. Verificar que el token es válido ───────────────
    // jwt.verify() lanza un error automáticamente si:
    // - El token fue alterado (JsonWebTokenError)
    // - El token expiró (TokenExpiredError)
    // Nuestro errorHandler ya maneja ambos casos
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded contiene el payload que guardamos al crear el token
    // En nuestro caso: { id: "664abc...", iat: 1234, exp: 5678 }
    // iat = issued at (cuándo se creó)
    // exp = expiration (cuándo expira)

    // ── 3. Verificar que el usuario aún existe ────────────
    // El token puede ser válido pero el usuario pudo haber
    // sido eliminado después de que se generó el token
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("El usuario de este token ya no existe", 401));
    }

    // ── 4. Verificar que la cuenta está activa ────────────
    if (!user.active) {
      return next(new AppError("Esta cuenta ha sido desactivada", 401));
    }

    // ── 5. Guardar el usuario en req para usarlo después ──
    // Esto es clave: cualquier controlador que venga después
    // de este middleware tendrá acceso a req.user
    req.user = user;

    // Pasamos al siguiente middleware o controlador
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;

/* 📒 Conceptos clave:

Authorization header → es el lugar estándar donde se envían los tokens en HTTP. El formato Bearer <token> es una convención universal.
jwt.verify() → decodifica el token Y verifica su firma. Si alguien modificó el payload, la firma no coincide y lanza un error automáticamente.
req.user = user → esto es muy poderoso. Al guardar el usuario en req, se lo "pasamos" a todos los middlewares y controladores que vengan después. Así saben quién es el usuario autenticado sin volver a consultar la base de datos.
*/
