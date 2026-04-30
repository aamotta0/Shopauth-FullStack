const jwt = require("jsonwebtoken");

// Esta función recibe el ID del usuario y genera un token firmado
const generateToken = (userId) => {
  return jwt.sign(
    // PAYLOAD: datos que queremos guardar dentro del token
    // No pongas información sensible aquí (como contraseñas)
    // porque el payload es legible por cualquiera
    { id: userId },

    // SECRET: la clave con la que firmamos el token
    // Si alguien altera el payload, la firma no coincidirá
    process.env.JWT_SECRET,

    // OPCIONES
    { expiresIn: process.env.JWT_EXPIRES_IN }, // Ej: "7d", "24h", "60m"
  );
};

module.exports = generateToken;

// jwt.sign(payload, secret, opciones) → crea y firma el token. El servidor es el único que conoce el JWT_SECRET, por eso es el único que puede crear tokens válidos.

/* ¿Qué es exactamente un JWT?

Un JWT (JSON Web Token) tiene 3 partes separadas por puntos:
eyJhbGciOiJIUzI1NiJ9  .  eyJ1c2VySWQiOiI2NjQifQ  .  SflKxwRJSMeKKF2QT4fw
      HEADER                      PAYLOAD                    SIGNATURE
   (tipo y algoritmo)         (datos del usuario)         (firma de seguridad)

El payload contiene información del usuario (como su ID y rol) y cualquiera puede leerlo. La firma es lo que garantiza que el token no fue alterado. Si alguien modifica el payload, la firma ya no coincide y el servidor lo rechaza.

*/
