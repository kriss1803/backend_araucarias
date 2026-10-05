const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const usuarioRoutes = require("./routes/usuario.routes");
const authRoutes = require("./routes/auth.routes");
const areaRoutes = require("./routes/area.routes");
const reservaRoutes = require("./routes/reserva.routes");
const alicuotaRoutes = require("./routes/alicuotas.routes");
const pagoRoutes = require("./routes/pagos.routes");

const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.get("/", (req, res) => {
res.json({
mensaje: "Backend Araucarias funcionando 🚀"
});
});

app.use("/api/usuarios", usuarioRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/areas", areaRoutes);

app.use("/api/reservas", reservaRoutes);

app.use("/api/alicuotas", alicuotaRoutes);

app.use("/api/pagos", pagoRoutes);

module.exports = app;
