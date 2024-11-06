const pool = require('../config/database');

const getMotivos = async () => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute('SELECT * FROM `Motivo`');
        return results;
    } finally {
        connection.release();
    }
};

const postMotivoEstado = async (SN, motivo) => {
    const connection = await pool.getConnection();
    try {
        await connection.execute('UPDATE `ONU` SET Motivo_estado = ? WHERE `SN` = ?', [motivo, SN]);
        return `Se registró el motivo: ${motivo} en la ONU con SN: ${SN}`;
    } finally {
        connection.release();
    }
};


module.exports = {
    getMotivos,
    postMotivoEstado,
};
