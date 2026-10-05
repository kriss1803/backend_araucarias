const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true,
        createdAt: true
      }
    });

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;

    const existe = await prisma.usuario.findUnique({
      where: { correo }
    });

    if (existe) {
      return res.status(400).json({
        mensaje: "El correo ya está registrado"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password: passwordHash,
        rol
      }
    });

    res.status(201).json(usuario);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario
};