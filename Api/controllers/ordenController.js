const ordenService = require('../services/ordenService');

const postOrden = async (req, res) => {
    try {
        const orden = await ordenService.postOrden(req.body);
        res.json(orden);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden', error: error.message });
    }
};

const updateOrden = async (req, res) => {
    const { id } = req.params;
    try {
        const orden = await ordenService.updateOrden(id, req.body);
        res.json(orden);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la orden', error: error.message });
    }
};

const getOrdenActiva = async (req, res) => {
    try {
        const orden = await ordenService.getOrdenActiva();
        res.json(orden);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden activa', error: error.message });
    }
};

const getOrdenes = async (req, res) => {
    try {
        const ordenes = await ordenService.getOrdenes();
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ordenes', error: error.message });
    }
};

const getOrden = async (req, res) => {
    const { id } = req.params;
    try {
        const orden = await ordenService.getOrden(id);
        res.json(orden);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden', error: error.message });
    }
};

const getONUsOrden = async (req, res) => {
    const { id } = req.params;
    try {
        const onus = await ordenService.getONUsOrden(id);
        res.json(onus);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ONUs de la orden', error: error.message });
    }
};

const activarOrden = async (req, res) => {
    const { username } = req.body;
    try {
        const result = await ordenService.activarOrden(username);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al activar la orden', error: error.message });
    }
};


const terminarOrden = async (req, res) => {
    const { username } = req.body;
    try {
        const result = await ordenService.terminarOrden(username);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al terminar la orden', error: error.message });
    }
};

const recogerOrden = async (req, res) => {
    const { id, username } = req.body;
    try {
        const result = await ordenService.recogerOrden(id, username);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al marcar la orden como recogida', error: error.message });
    }
};

module.exports = {
    postOrden,
    updateOrden,
    getOrdenActiva,
    getOrdenes,
    getOrden,
    getONUsOrden,
    activarOrden,
    terminarOrden,
    recogerOrden,
};
