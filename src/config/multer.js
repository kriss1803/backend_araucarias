const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/comprobantes/");
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nombre = `comprobante-${Date.now()}${extension}`;

    cb(null, nombre);
  },
});

const fileFilter = (req, file, cb) => {
  console.log("ARCHIVO RECIBIDO:");
  console.log("Nombre:", file.originalname);
  console.log("Mimetype:", file.mimetype);

  const extension = path.extname(file.originalname).toLowerCase();

  const extensionesPermitidas = [
    ".jpg",
    ".jpeg",
    ".png",
    ".pdf",
  ];

  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "application/pdf",
  ];

  if (
    tiposPermitidos.includes(file.mimetype) ||
    extensionesPermitidas.includes(extension)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos JPG, JPEG, PNG o PDF"));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;