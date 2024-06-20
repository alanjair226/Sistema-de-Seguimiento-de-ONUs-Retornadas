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

const registerONU = async (SN, motivoId, usuario, modeloId) => {
    try {
        const connection = await pool.getConnection();

        try {
            const [modelo] = await connection.execute(`SELECT * FROM modelo_onu WHERE id = ?`, [modeloId]);
            const modelo_nombre = modelo[0].nombre;

            const [ordenactiva] = await connection.execute(`SELECT * FROM orden WHERE estado = 'Activa'`);
            if (ordenactiva.length === 0) {
                return 'No hay una orden activa';
            }

            const orden = ordenactiva[0].id;

            // Verificar si la columna existe en ordenactiva[0]
            if (ordenactiva[0][modelo_nombre] === 0) {
                return 'en la orden no se encuentran ONUs disponibles de este modelo para revisar'
            } else{
                console.log('si hay modems')
            }
            const [existingONUs] = await connection.execute('SELECT * FROM `ONU` WHERE `SN` = ?', [SN]);

            if (existingONUs.length > 0) {
                if (existingONUs[0].veces_instalada >= 2) {
                    return 'Esta ONU DEBE DESECHARSE';
                }
                await connection.execute('UPDATE `ONU` SET `estado` = ?, `veces_instalada` = `veces_instalada` + 1, `orden_id` = ? WHERE `SN` = ?', ['desechado', orden, SN]);
                await connection.execute('INSERT INTO `ONU_Motivo` (`onu_sn`, `motivo_id`, `usuario`, `modelo_id`) VALUES (?, ?, ?, ?)', [SN, motivoId, usuario, modeloId]);
                return 'La ONU se registra y se desecha';
            } else {
                await connection.execute('INSERT INTO `ONU` (`SN`, `estado`, `veces_instalada`, `modelo_id`, `orden_id`) VALUES (?, ?, ?, ?, ?)', [SN, 'almacen', 1, modeloId, orden]);
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
                await connection.execute('UPDATE `ONU` SET `estado` = ?, `veces_instalada` = `veces_instalada` WHERE `SN` = ?', ['desechado', SN]);
            } else {
                await connection.execute('INSERT INTO `ONU` (`SN`, `estado`, `veces_instalada`) VALUES (?, ?, ?)', [SN, 'desechado', 1]);
            }
            return 'La ONU se ha desechado';
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        throw err;
    }
};

const almacenarONU = async (SN, motivoId, usuario) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [existingONUs] = await connection.execute('SELECT * FROM `ONU` WHERE `SN` = ?', [SN]);
            if (existingONUs.length > 0) {
                await connection.execute('UPDATE `ONU` SET `estado` = ?, `veces_instalada` = `veces_instalada` WHERE `SN` = ?', ['almacen', SN]);
            } else {
                await connection.execute('INSERT INTO `ONU` (`SN`, `estado`, `veces_instalada`) VALUES (?, ?, ?)', [SN, 'almacen', 1]);
            }
            return 'La ONU se ha almacenado';
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

const getSinMotivoEstatus = async () => {
    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.execute(`SELECT ONU.SN, ONU.estado, ONU.Motivo_estado FROM ONU WHERE ONU.Motivo_estado = ''`);
            return results;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        throw err;
    }
};

const postMotivoEstado = async (SN, motivo) => {
    try {
        const connection = await pool.getConnection();
        try {
            await connection.execute('UPDATE `ONU` SET Motivo_estado=? WHERE ONU.SN = ?', [motivo, SN]);

            return `Se registro el motivo: ${motivo} en ${SN}`;
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

const getModelos = async () => {
    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.execute('SELECT * FROM `modelo_onu`');
            return results;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al obtener los motivos:', error);
        throw error;
    }
};

const getUltimasONUs = async () => {
    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.execute(`
                SELECT ONU.SN, ONU.estado, ONU.Motivo_estado, ONU_Motivo.fecha
                FROM ONU 
                INNER JOIN ONU_Motivo ON ONU.SN = ONU_Motivo.onu_sn
                WHERE DATE(ONU_Motivo.fecha) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                AND DATE(ONU_Motivo.fecha) <= CURDATE();

            `);
            return results;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        throw err;
    }
};

const postOrden = async (Huawei_V5, Huawei_A5_H5, TpLink_G3V_Negro, TpLink_XC220, Nokia, Otros) => {
    try {
        const connection = await pool.getConnection();
        try {
            await connection.execute(`INSERT INTO orden (estado, recibido, Huawei_V5, Huawei_A5_H5, TpLink_G3V_Negro, TpLink_XC220, Nokia, Otros)
                                        VALUES ('Por entregar', 'no', ?, ?, ?, ?, ?, ?)`, [Huawei_V5, Huawei_A5_H5, TpLink_G3V_Negro, TpLink_XC220, Nokia, Otros]);
            const total = Huawei_V5 + Huawei_A5_H5 + TpLink_G3V_Negro + TpLink_XC220 + Nokia + Otros;
            const respuestaJSON = {
                mensaje: `Se registró la orden`,
                detalles: {
                    Huawei_V5,
                    Huawei_A5_H5,
                    TpLink_G3V_Negro,
                    TpLink_XC220,
                    Nokia,
                    Otros,
                    total
                }
            };
            return respuestaJSON;
        } finally {
            connection.release();
        }
    } catch (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        throw err;
    }
};

const getOrden = async () => {
    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.execute(`SELECT * FROM orden WHERE estado = 'Por entregar' OR estado = 'Activa'`);
            return results;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        throw error;
    }
};

const activarOrden = async () => {
    try {
        const connection = await pool.getConnection();
        try {
            const [results] = await connection.execute(`SELECT * FROM orden WHERE estado = 'Por entregar' OR estado = 'Activa'`);
            await connection.execute(`UPDATE orden SET estado='Activa' WHERE id = ?`,[results[0].id]);
            return 'Soporte y Almacen quedarón de acuerdo en que la cantidad de ONUs entregada coincide con la orden';
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al obtener la orden:', error);
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
    getMotivos,
    almacenarONU,
    getSinMotivoEstatus,
    postMotivoEstado,
    getUltimasONUs,
    postOrden,
    getOrden,
    getModelos,
    activarOrden
}
