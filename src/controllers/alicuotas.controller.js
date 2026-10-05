const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const obtenerAlicuotas = async (req, res) => {
    try {
        const alicuotas = await prisma.alicuota.findMany({
        orderBy: {
        fechaVencimiento: "asc",
        },
    });
    res.json(alicuotas);


    } catch (error) {
        console.error("ERROR REAL AL OBTENER ALICUOTAS:");
        console.error(error);


        res.status(500).json({
        mensaje: "Error al obtener las alícuotas",
        });

    }
};


const obtenerAlicuotaPorId = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
        return res.status(400).json({
            mensaje: "El ID de la alícuota no es válido",
        });
        }

        const alicuota = await prisma.alicuota.findUnique({
        where: {
            id,
        },
        });

        if (!alicuota) {
        return res.status(404).json({
            mensaje: "Alícuota no encontrada",
        });
        }

        res.json(alicuota);


    } catch (error) {
        console.error("ERROR REAL AL OBTENER ALICUOTA:");
        console.error(error);


        res.status(500).json({
        mensaje: "Error al obtener la alícuota",
        });


    }
};


const crearAlicuota = async (req, res) => {
    try {
        const {
        periodo,
        monto,
        fechaVencimiento,
        estado,
        viviendaId,
        } = req.body;


        if (!periodo || monto === undefined || !fechaVencimiento || !viviendaId) {
        return res.status(400).json({
            mensaje:
            "periodo, monto, fechaVencimiento y viviendaId son obligatorios",
        });
        }

        const vivienda = await prisma.vivienda.findUnique({
        where: {
            id: Number(viviendaId),
        },
        });

        if (!vivienda) {
        return res.status(404).json({
            mensaje: "La vivienda no existe",
        });
        }

        const alicuota = await prisma.alicuota.create({
        data: {
            periodo,
            monto,
            fechaVencimiento: new Date(fechaVencimiento),
            estado: estado || "PENDIENTE",
            viviendaId: Number(viviendaId),
        },
        });

        res.status(201).json(alicuota);


    } catch (error) {
        console.error("ERROR REAL AL CREAR ALICUOTA:");
        console.error(error);


        res.status(500).json({
        mensaje: "Error al crear la alícuota",
        });


    }
};


const actualizarAlicuota = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
        return res.status(400).json({
            mensaje: "El ID de la alícuota no es válido",
        });
        }

        const {
        periodo,
        monto,
        fechaVencimiento,
        estado,
        viviendaId,
        } = req.body;

        const alicuotaExistente = await prisma.alicuota.findUnique({
        where: {
            id,
        },
        });

        if (!alicuotaExistente) {
        return res.status(404).json({
            mensaje: "Alícuota no encontrada",
        });
        }

        if (viviendaId !== undefined) {
        const vivienda = await prisma.vivienda.findUnique({
            where: {
            id: Number(viviendaId),
            },
        });

        if (!vivienda) {
            return res.status(404).json({
            mensaje: "La vivienda no existe",
            });
        }
        }

        const alicuota = await prisma.alicuota.update({
        where: {
            id,
        },
        data: {
            ...(periodo !== undefined && { periodo }),
            ...(monto !== undefined && { monto }),
            ...(fechaVencimiento !== undefined && {
            fechaVencimiento: new Date(fechaVencimiento),
            }),
            ...(estado !== undefined && { estado }),
            ...(viviendaId !== undefined && {
            viviendaId: Number(viviendaId),
            }),
        },
        });

        res.json(alicuota);
    

    } catch (error) {
        console.error("ERROR REAL AL ACTUALIZAR ALICUOTA:");
        console.error(error);

        
        res.status(500).json({
        mensaje: "Error al actualizar la alícuota",
        });
   
    }
};

module.exports = {
obtenerAlicuotas,
obtenerAlicuotaPorId,
crearAlicuota,
actualizarAlicuota,
};
