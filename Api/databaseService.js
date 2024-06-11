const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
};

const pool = mysql.createPool(dbConfig);

const getONUBySN = async (SN) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.execute('SELECT * FROM `ONU` WHERE `SN` = ?', [SN]);
            return results[0];
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        throw err;
    }
};

const registerONU = async (SN, motivoId, usuario) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [existingONUs] = await connection.execute('SELECT * FROM `ONU` WHERE `SN` = ?', [SN]);
            if (existingONUs.length > 0) {
                if (existingONUs[0].veces_instalada >= 2) {
                    return 'Esta ONU DEBE DESECHARSE';
                }
                await connection.execute('UPDATE `ONU` SET `estado` = ?, `veces_instalada` = ? WHERE `SN` = ?', ['desechado', 2, SN]);
                await connection.execute('INSERT INTO `ONU_Motivo` (`onu_sn`, `motivo_id`, `usuario`) VALUES (?, ?, ?)', [SN, motivoId, usuario]);
                return 'La ONU se registra y se desecha';
            } else {
                await connection.execute('INSERT INTO `ONU` (`SN`, `estado`, `veces_instalada`) VALUES (?, ?, ?)', [SN, 'almacen', 1]);
                await connection.execute('INSERT INTO `ONU_Motivo` (`onu_sn`, `motivo_id`, `usuario`) VALUES (?, ?, ?)', [SN, motivoId, usuario]);
                return 'La ONU se registra y se reutiliza';
            }
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        throw err;
    }
};

const desecharONU = async (SN, motivoId, usuario) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [existingONUs] = await connection.execute('SELECT * FROM `ONU` WHERE `SN` = ?', [SN]);
            if (existingONUs.length > 0) {
                await connection.execute('UPDATE `ONU` SET `estado` = ?, `veces_instalada` = ? WHERE `SN` = ?', ['desechado', 2, SN]);
            } else {
                await connection.execute('INSERT INTO `ONU` (`SN`, `estado`, `veces_instalada`) VALUES (?, ?, ?)', [SN, 'desechado', 1]);
            }
            await connection.execute('INSERT INTO `ONU_Motivo` (`onu_sn`, `motivo_id`, `usuario`) VALUES (?, ?, ?)', [SN, motivoId, usuario]);
            return 'La ONU se ha desechado';
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        throw err;
    }
};

const getMotivosBySN = async (SN) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.execute(`
                SELECT o.SN, GROUP_CONCAT(m.descripcion SEPARATOR ', ') AS motivos
                FROM ONU o
                JOIN ONU_Motivo om ON o.SN = om.onu_sn
                JOIN Motivo m ON om.motivo_id = m.id
                WHERE o.SN = ?
                GROUP BY o.SN
            `, [SN]);
            return results[0];
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        throw err;
    }
};

const getMotivos = async () => {
    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.execute('SELECT * FROM `Motivo`');
            return results;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al obtener los motivos:', error);
        throw error;
    }
};

const closePool = async () => {
    try {
        await pool.end();
        console.log('Pool de conexiones cerrado');
    } catch (err) {
        console.error('Error cerrando el pool de conexiones:', err.stack);
    }
};

module.exports = {
    getONUBySN,
    registerONU,
    desecharONU,
    getMotivosBySN,
    closePool,
    getMotivos
};
