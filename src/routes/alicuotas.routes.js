const express = require('express');

const {
obtenerAlicuotas,
obtenerAlicuotaPorId,
crearAlicuota,
actualizarAlicuota,
} = require('../controllers/alicuotas.controller');

const router = express.Router();

// GET /api/alicuotas
router.get('/', obtenerAlicuotas);

// GET /api/alicuotas/:id
router.get('/:id', obtenerAlicuotaPorId);

// POST /api/alicuotas
router.post('/', crearAlicuota);

// PUT /api/alicuotas/:id
router.put('/:id', actualizarAlicuota);

module.exports = router;
