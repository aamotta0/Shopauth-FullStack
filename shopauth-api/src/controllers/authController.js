const User = require("../models/User");
const AppError = require("../middlewares/AppError");
const generateToken = require("../middlewares/generateToken");

// ─────────────────────────────────────────
// REGISTRO → POST /api/auth/register
// ─────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    // Extraemos solo los campos que necesitamos del body
    // Nunca usamos req.body directo en el modelo para evitar
    // que alguien envíe campos no deseados como role: "admin"
    const { name, email, password, role } = req.body;

    // Verificamos si ya existe un usuario con ese email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new AppError("Ya existe una cuenta con ese email", 400));
    }

    // Creamos el usuario — el hook pre('save') hasheará
    // la contraseña automáticamente antes de guardar
    const user = await User.create({ name, email, password, role });

    // Generamos el token con el ID del nuevo usuario
    const token = generateToken(user._id);

    // Respondemos con 201 (Created) y el token
    // No enviamos el password (select: false lo protege)
    res.status(201).json({
      success: true,
      message: "¡Cuenta creada exitosamente!",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// LOGIN → POST /api/auth/login
// ─────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validamos que llegaron ambos campos
    if (!email || !password) {
      return next(new AppError("Por favor ingresa tu email y contraseña", 400));
    }

    // Buscamos el usuario por email
    // Como password tiene select: false, debemos pedirlo explícitamente
    // con .select('+password') para poder compararlo
    const user = await User.findOne({ email }).select("+password");

    // Si no existe el usuario O la contraseña no coincide
    // damos el MISMO mensaje para no revelar cuál fue el error
    // (seguridad: no queremos confirmar si un email existe o no)
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Email o contraseña incorrectos", 401));
    }

    // Verificamos que la cuenta esté activa
    if (!user.active) {
      return next(new AppError("Esta cuenta ha sido desactivada", 401));
    }

    // Generamos el token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: `¡Bienvenido de vuelta, ${user.name}!`,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────
// PERFIL → GET /api/auth/me
// (ruta protegida, la veremos en la fase 4)
// ─────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // req.user lo agrega el middleware de autenticación
    // que construiremos en la siguiente fase
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };

/* 📒 Detalles de seguridad importantes:

Extraemos { name, email, password } del body en lugar de pasar req.body directo. Así evitamos que alguien registre una cuenta con role: "admin" enviándolo en el body.
En el login damos el mismo mensaje para email incorrecto y contraseña incorrecta. Esto evita que un atacante use tu API para descubrir qué emails están registrados.
.select('+password') → el + le dice a Mongoose que incluya este campo aunque tenga select: false.
*/
