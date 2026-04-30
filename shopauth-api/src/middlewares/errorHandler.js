const errorHandler = (err, req, res, next) => {
  console.error("💥 Error:", err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";

  // ID con formato inválido
  if (err.name === "CastError") {
    statusCode = 400;
    message = `ID inválido: "${err.value}"`;
  }

  // Error de validación de Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Email duplicado
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Ya existe una cuenta con ese ${field}`;
  }

  // Token JWT inválido → lo veremos en la siguiente fase
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token inválido, por favor inicia sesión nuevamente";
  }

  // Token JWT expirado → lo veremos en la siguiente fase
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Tu sesión ha expirado, por favor inicia sesión nuevamente";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
