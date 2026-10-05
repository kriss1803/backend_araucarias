const express = require("express");

const router = express.Router();

const verificarToken = require("../middleware/auth");

const {
    obtenerReservas,
    crearReserva,
    eliminarReserva
} = require("../controllers/reserva.controller");

const verificarRol = require("../middleware/roles");

router.get("/", verificarToken, obtenerReservas);

router.post(
    "/",
    verificarToken,
    verificarRol("Administrador","Residente"),
    crearReserva
);

router.delete(
    "/:id",
    verificarToken,
    verificarRol("Administrador"),
    eliminarReserva
);

module.exports = router;