const modeloService = require('../services/modeloService');

const getModelos = async (req, res) => {
    try {
        const modelos = await modeloService.getModelos();
        res.json(modelos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los modelos', error: error.message });
    }
};


module.exports = {
    getModelos,
};
