const pool = require('../config/database');

const getUltimasONUs = async () => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute(`
            SELECT ONU.SN, ONU.estado, ONU.Motivo_estado, ONU_Motivo.fecha
            FROM ONU 
            INNER JOIN ONU_Motivo ON ONU.SN = ONU_Motivo.onu_sn
            WHERE DATE(ONU_Motivo.fecha) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            ORDER BY fecha DESC
        `);
        return results;
    } finally {
        connection.release();
    }
};

const getONUBySN = async (SN) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute('SELECT * FROM `ONU` WHERE `SN` = ?', [SN]);
        return results[0];
    } finally {
        connection.release();
    }
};

const registerONU = async (SN, motivoId, usuario, modeloId) => {
    const connection = await pool.getConnection();
    try {
        const [modelo] = await connection.execute(`SELECT * FROM modelo_onu WHERE id = ?`, [modeloId]);
        const modelo_nombre = modelo[0].nombre;

        const [ordenactiva] = await connection.execute(`SELECT * FROM orden WHERE estado = 'Activa'`);
        if (ordenactiva.length === 0) {
            return 'No hay una orden activa';
        }

        const orden = ordenactiva[0].id;

        if (ordenactiva[0][modelo_nombre] === 0) {
            return 'En la orden no se encuentran ONUs disponibles de este modelo para revisar';
        } else {
            await connection.execute(`UPDATE orden SET ${modelo_nombre} = ${modelo_nombre} - 1 WHERE id = ?`, [orden]);
        }

        const [existingONUs] = await connection.execute('SELECT * FROM `ONU` WHERE `SN` = ?', [SN]);

        if (existingONUs.length > 0) {
            if (existingONUs[0].veces_instalada >= 2) {
                return 'Esta ONU DEBE DESECHARSE';
            }
            await connection.execute(`UPDATE ONU SET estado = ?, veces_instalada = veces_instalada + 1, orden_id = ?, Motivo_estado = '' WHERE SN = ?`, ['desechado', orden, SN]);
            await connection.execute('INSERT INTO `ONU_Motivo` (`onu_sn`, `motivo_id`, `usuario`) VALUES (?, ?, ?)', [SN, motivoId, usuario]);
            return 'La ONU se registra y se desecha';
        } else {
            await connection.execute('INSERT INTO `ONU` (`SN`, `estado`, `veces_instalada`, `modelo_id`, `orden_id`) VALUES (?, ?, ?, ?, ?)', [SN, 'almacen', 1, modeloId, orden]);
            await connection.execute('INSERT INTO `ONU_Motivo` (`onu_sn`, `motivo_id`, `usuario`) VALUES (?, ?, ?)', [SN, motivoId, usuario]);
            return 'La ONU se registra y se reutiliza';
        }
    } finally {
        connection.release();
    }
};

const desecharONU = async (SN, motivoId, usuario) => {
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
};

const almacenarONU = async (SN, motivoId, usuario) => {
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
};

const getMotivosBySN = async (SN) => {
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
};

const getSinMotivoEstatus = async () => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute('SELECT ONU.SN, ONU.estado FROM ONU WHERE ONU.Motivo_estado = ""');
        return results;
    } finally {
        connection.release();
    }
};

const postMotivoEstado = async (SN, motivo) => {
    const connection = await pool.getConnection();
    try {
        await connection.execute('UPDATE `ONU` SET Motivo_estado=? WHERE ONU.SN = ?', [motivo, SN]);
        return `Se registró el motivo: ${motivo} en ${SN}`;
    } finally {
        connection.release();
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
