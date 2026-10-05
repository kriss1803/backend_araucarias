const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generarComprobantePDF = (pago, rutaSalida) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const stream = fs.createWriteStream(rutaSalida);

    doc.pipe(stream);

    doc.fontSize(18).text("CONJUNTO ARAUCARIAS DE QUITUMBE", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(16).text("COMPROBANTE DE PAGO", {
      align: "center",
    });

    doc.moveDown(2);

    doc.fontSize(12);

    doc.text(`Residente: ${pago.usuario.nombre}`);
    doc.text(`Vivienda: ${pago.usuario.vivienda?.numero || "No registrada"}`);

    doc.moveDown();

    doc.text(`Periodo: ${pago.alicuota.periodo}`);
    doc.text(`Monto: $${Number(pago.monto).toFixed(2)}`);

    const fecha = new Date(pago.fechaPago).toLocaleDateString("es-EC");

    doc.text(`Fecha de pago: ${fecha}`);
    doc.text(`Método: ${pago.metodoPago}`);
    doc.text(`Estado: ${pago.estado}`);

    doc.end();

    stream.on("finish", () => {
      resolve(rutaSalida);
    });

    stream.on("error", (error) => {
      reject(error);
    });
  });
};

module.exports = {
  generarComprobantePDF,
};