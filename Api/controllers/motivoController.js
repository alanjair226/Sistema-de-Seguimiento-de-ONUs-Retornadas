const motivoService = require('../services/motivoService');

const getMotivos = async (req, res) => {
    try {
        const motivos = await motivoService.getMotivos();
        res.json(motivos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los motivos', error: error.message });
    }
};

const postMotivoEstado = async (req, res) => {
    const { SN, motivo } = req.body;
    if (!SN || !motivo) {
        return res.status(400).json({ message: 'SN y motivo son requeridos' });
    }
    try {
        const response = await motivoService.postMotivoEstado(SN, motivo);
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar el motivo', error: error.message });
    }
};


module.exports = {
    getMotivos,
    postMotivoEstado,
};
