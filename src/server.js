require("./workers/notificaciones");

require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://192.168.18.8:${PORT}`);
});