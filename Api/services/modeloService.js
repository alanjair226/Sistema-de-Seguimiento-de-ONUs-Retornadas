const pool = require('../config/database');

const getModelos = async () => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute('SELECT * FROM `modelo_onu`');
        return results;
    } finally {
        connection.release();
    }
};

module.exports = {
    getModelos
};
