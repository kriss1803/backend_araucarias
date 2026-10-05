const { PrismaClient } = require("@prisma/client");
const upload = require("../config/multer");
const path = require("path");
const { generarComprobantePDF } = require("../services/pdf.service");

const prisma = new PrismaClient();

// POST /api/pagos
const crearPago = async (req, res) => {
try {
const {
monto,
fechaPago,
metodoPago,
estado,
observacion,
usuarioId,
alicuotaId,
} = req.body;


if (
  monto === undefined ||
  !metodoPago ||
  !usuarioId ||
  !alicuotaId
) {
  return res.status(400).json({
    mensaje:
      "monto, metodoPago, usuarioId y alicuotaId son obligatorios",
  });
}

const usuario = await prisma.usuario.findUnique({
  where: {
    id: Number(usuarioId),
  },
});

if (!usuario) {
  return res.status(404).json({
    mensaje: "El usuario no existe",
  });
}

const alicuota = await prisma.alicuota.findUnique({
  where: {
    id: Number(alicuotaId),
  },
});

if (!alicuota) {
  return res.status(404).json({
    mensaje: "La alícuota no existe",
  });
}

const pago = await prisma.pago.create({
  data: {
    monto,
    fechaPago: fechaPago ? new Date(fechaPago) : new Date(),
    metodoPago,
    estado: estado || "PENDIENTE",
    observacion: observacion || null,
    usuarioId: Number(usuarioId),
    alicuotaId: Number(alicuotaId),
  },
});

res.status(201).json(pago);


} catch (error) {
console.error("ERROR AL CREAR PAGO:");
console.error(error);


res.status(500).json({
  mensaje: "Error al crear el pago",
});


}
};

// GET /api/pagos
const obtenerPagos = async (req, res) => {
try {
const pagos = await prisma.pago.findMany({
orderBy: {
fechaPago: "desc",
},
});


res.status(200).json(pagos);


} catch (error) {
console.error("ERROR AL OBTENER PAGOS:");
console.error(error);


res.status(500).json({
  mensaje: "Error al obtener los pagos",
});


}
};

// GET /api/pagos/:id
const obtenerPagoPorId = async (req, res) => {
try {
const id = Number(req.params.id);


if (isNaN(id)) {
  return res.status(400).json({
    mensaje: "El ID del pago no es válido",
  });
}

const pago = await prisma.pago.findUnique({
  where: {
    id,
  },
});

if (!pago) {
  return res.status(404).json({
    mensaje: "Pago no encontrado",
  });
}

res.status(200).json(pago);


} catch (error) {
console.error("ERROR AL OBTENER PAGO:");
console.error(error);


res.status(500).json({
  mensaje: "Error al obtener el pago",
});


}
};

// POST /api/pagos/:id/comprobante
const subirComprobante = [
  upload.single("comprobante"),

  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          mensaje: "El ID del pago no es válido",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          mensaje: "Debes subir un comprobante",
        });
      }

      const pago = await prisma.pago.findUnique({
        where: {
          id,
        },
      });

      if (!pago) {
        return res.status(404).json({
          mensaje: "Pago no encontrado",
        });
      }

      const comprobante = await prisma.comprobante.create({
        data: {
          nombreArchivo: req.file.originalname,
          rutaArchivo: req.file.path,
          tipoArchivo: req.file.mimetype,
          pagoId: id,
        },
      });

      await prisma.alicuota.update({
        where: {
          id: pago.alicuotaId,
        },
        data: {
          estado: "PAGADO",
        },
      });

      res.status(201).json({
        mensaje: "Comprobante subido correctamente",
        comprobante,
      });
    } catch (error) {
      console.error("ERROR AL SUBIR COMPROBANTE:");
      console.error(error);

      res.status(500).json({
        mensaje: "Error al subir el comprobante",
      });
    }
  },
];

// GET /api/pagos/:id/pdf
const generarPDFPago = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        mensaje: "El ID del pago no es válido",
      });
    }

    const pago = await prisma.pago.findUnique({
      where: {
        id,
      },
      include: {
        usuario: {
          include: {
            vivienda: true,
          },
        },
        alicuota: true,
      },
    });

    if (!pago) {
      return res.status(404).json({
        mensaje: "Pago no encontrado",
      });
    }

    const carpetaPDF = path.join(
      process.cwd(),
      "uploads",
      "comprobantes"
    );

    const nombrePDF = `pago-${pago.id}.pdf`;
    const rutaPDF = path.join(carpetaPDF, nombrePDF);

    await generarComprobantePDF(pago, rutaPDF);

    res.download(rutaPDF, nombrePDF);
  } catch (error) {
    console.error("ERROR AL GENERAR PDF:");
    console.error(error);

    res.status(500).json({
      mensaje: "Error al generar el PDF",
    });
  }
};

module.exports = {
  crearPago,
  obtenerPagos,
  obtenerPagoPorId,
  subirComprobante,
  generarPDFPago,
};
