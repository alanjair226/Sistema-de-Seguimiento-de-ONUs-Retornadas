const onusService = require('../services/onusService');

const getUltimasONUs = async (req, res) => {
    try {
        const ONUs = await onusService.getUltimasONUs();
        res.json(ONUs);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ONUs', error: error.message });
    }
};

const getONUBySN = async (req, res) => {
    const { sn } = req.params;
    try {
        const result = await onusService.getONUBySN(sn);
        if (!result) {
            res.status(404).json({ message: 'ONU no encontrada' });
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la ONU', error: error.message });
    }
};

const registerONU = async (req, res) => {
    const { SN, motivoId, modeloId } = req.body;
    if (!SN || !motivoId) {
        return res.status(400).json({ message: 'SN y motivoId son requeridos' });
    }
    try {
        const response = await onusService.registerONU(SN, motivoId, 'usuario general', modeloId);
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la ONU', error: error.message });
    }
};

const desecharONU = async (req, res) => {
    const { SN, motivoId } = req.body;
    if (!SN || !motivoId) {
        return res.status(400).json({ message: 'SN y motivoId son requeridos' });
    }
    try {
        const response = await onusService.desecharONU(SN, motivoId, 'usuario general');
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al desechar la ONU', error: error.message });
    }
};

const almacenarONU = async (req, res) => {
    const { SN, motivoId } = req.body;
    if (!SN || !motivoId) {
        return res.status(400).json({ message: 'SN y motivoId son requeridos' });
    }
    try {
        const response = await onusService.almacenarONU(SN, motivoId, 'usuario general');
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al almacenar la ONU', error: error.message });
    }
};

const getMotivosBySN = async (req, res) => {
    const { sn } = req.params;
    try {
        const result = await onusService.getMotivosBySN(sn);
        if (!result) {
            res.status(404).json({ message: 'ONU no encontrada' });
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los motivos de la ONU', error: error.message });
    }
};

const getSinMotivoEstatus = async (req, res) => {
    try {
        const ONUs = await onusService.getSinMotivoEstatus();
        res.json(ONUs);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ONUs', error: error.message });
    }
};

const postMotivoEstado = async (req, res) => {
    const { SN, motivo } = req.body;
    if (!SN || !motivo) {
        return res.status(400).json({ message: 'SN y motivo son requeridos' });
    }
    try {
        const response = await onusService.postMotivoEstado(SN, motivo);
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar motivo', error: error.message });
    }
};

module.exports = {
    getUltimasONUs,
    getONUBySN,
    registerONU,
    desecharONU,
    almacenarONU,
    getMotivosBySN,
    getSinMotivoEstatus,
    postMotivoEstado,
};
