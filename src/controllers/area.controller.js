const prisma = require("../config/prisma");
const cache = require("../cache/cache");

const obtenerAreas = async (req, res) => {

    const areasCache = cache.get("areas");

    if (areasCache) {

        console.log("Datos obtenidos desde CACHE");

        return res.json(areasCache);

    }

    console.log("Datos obtenidos desde BASE DE DATOS");

    const areas = await prisma.areaComun.findMany();

    cache.set("areas", areas);

    res.json(areas);

};

const crearArea = async (req, res) => {

    const area = await prisma.areaComun.create({
        data: req.body
    });

    cache.del("areas");

    res.status(201).json(area);

};

module.exports = {
    obtenerAreas,
    crearArea
};