const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/auth");

const {
    obtenerAreas,
    crearArea
} = require("../controllers/area.controller");

const verificarRol = require("../middleware/roles");

router.get("/", verificarToken, obtenerAreas);

router.post(
    "/",
    verificarToken,
    verificarRol("Administrador"),
    crearArea
);

module.exports = router;