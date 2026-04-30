const AppError = require("./AppError");

// Usamos una función que retorna un middleware
// Esto nos permite pasarle parámetros: authorize('admin', 'moderador')
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user ya existe porque protect() se ejecutó antes
    // Verificamos si el rol del usuario está en la lista permitida
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Tu rol "${req.user.role}" no tiene permiso para realizar esta acción`,
          403, // 403 = Forbidden (el usuario existe pero no tiene permiso)
        ),
      );
    }

    next();
  };
};

module.exports = authorize;

/* 📒 Conceptos clave:

...roles es un rest parameter. Permite que la función reciba cualquier cantidad de argumentos como un array. Entonces puedes hacer:
javascriptauthorize('admin')               // solo admin
authorize('admin', 'moderador') // admin o moderador
La diferencia entre 401 y 403:

401 Unauthorized → no estás identificado (sin token o token inválido)
403 Forbidden → estás identificado pero no tienes permiso

*/
