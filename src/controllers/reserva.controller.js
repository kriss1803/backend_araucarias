const prisma = require("../config/prisma");

const obtenerReservas = async (req, res) => {
    try {
        const reservas = await prisma.reserva.findMany({
            include: {
                usuario: {
                    select: {
                        id: true,
                        nombre: true
                    }
                },
                areaComun: {
                    select: {
                        id: true,
                        nombre: true
                    }
                }
            }
        });

        res.json(reservas);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener reservas",
            error: error.message
        });
    }
};


const crearReserva = async (req, res) => {
    try {
        const reserva = await prisma.reserva.create({
            data: req.body
        });

        res.status(201).json(reserva);

    } catch (error) {
        res.status(500).json({
            message: "Error al crear reserva",
            error: error.message
        });
    }
};

const eliminarReserva = async (req, res) => {
    try {
        const { id } = req.params;

        const reserva = await prisma.reserva.delete({
            where: {
                id: Number(id)
            }
        });

        res.json({
            message: "Reserva eliminada correctamente",
            reserva
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar reserva",
            error: error.message
        });
    }
};


module.exports = {
    obtenerReservas,
    crearReserva,
    eliminarReserva
};