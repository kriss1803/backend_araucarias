const express = require("express");

const {
  crearPago,
  obtenerPagos,
  obtenerPagoPorId,
  subirComprobante,
  generarPDFPago,
} = require("../controllers/pagos.controller");

const router = express.Router();

// POST /api/pagos
router.post("/", crearPago);

// GET /api/pagos
router.get("/", obtenerPagos);

// GET /api/pagos/:id
router.get("/:id", obtenerPagoPorId);

// POST /api/pagos/:id/comprobante
router.post("/:id/comprobante", subirComprobante);

// GET /api/pagos/:id/pdf
router.get("/:id/pdf", generarPDFPago);

module.exports = router;
