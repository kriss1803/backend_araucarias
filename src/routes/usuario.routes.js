const express = require("express");
const router = express.Router();

const {
  obtenerUsuarios,
  crearUsuario
} = require("../controllers/usuario.controller");

const verificarToken = require("../middleware/auth");

router.get("/", verificarToken, obtenerUsuarios);

router.post("/", crearUsuario);

module.exports = router;