const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true, // No pueden existir dos usuarios con el mismo email
      lowercase: true, // Guarda siempre en minúsculas: "Juan@Email.COM" → "juan@email.com"
      trim: true,
      // Validación con expresión regular para verificar formato de email
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingresa un email válido",
      ],
    },

    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      // select: false es MUY importante
      // Le dice a Mongoose que NUNCA incluya este campo en las consultas
      // Es decir, si haces User.find(), el password NO vendrá en el resultado
      select: false,
    },

    role: {
      type: String,
      enum: ["cliente", "admin"],
      default: "cliente", // Por defecto todo usuario nuevo es cliente
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// ─────────────────────────────────────────────────────
// MIDDLEWARE DE MONGOOSE (pre-save hook)
// Esta función se ejecuta AUTOMÁTICAMENTE antes de
// guardar cualquier documento en la base de datos
// ─────────────────────────────────────────────────────
userSchema.pre("save", async function () {
  // Si el password NO fue modificado, no hacemos nada
  if (!this.isModified("password")) return;

  // Hasheamos la contraseña antes de guardar
  this.password = await bcrypt.hash(this.password, 12);
});

// ─────────────────────────────────────────────────w────
// MÉTODO DE INSTANCIA
// Lo agregamos al Schema para poder usarlo en cualquier
// documento de tipo User: usuario.comparePassword(...)
// ─────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  // bcrypt.compare() hashea candidatePassword y lo compara
  // con el hash guardado (this.password)
  // Retorna true si coinciden, false si no
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

/*  📒Conceptos clave:
pre('save') hook → es un middleware propio de Mongoose. Se ejecuta justo antes de cada .save(). Lo usamos para hashear la contraseña automáticamente sin tener que recordarlo en el controlador.
this.isModified('password') → verifica si el campo password cambió en esta operación. Fundamental para no re-hashear innecesariamente.
Método de instancia → una función que vive en cada documento. Así puedes hacer unUsuario.comparePassword('123') directamente sobre el objeto.
select: false → protege el password para que nunca salga accidentalmente en una respuesta.
*/
