const pool = require('../config/database');


const getModelos = async () => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT nombre FROM modelo_onu');
        return rows.map(row => row.nombre);
    } finally {
        connection.release();
    }
};


const postOrden = async (ordenData) => {
    const connection = await pool.getConnection();
    console.log(ordenData)
    try {
        const ordenVerification = await getOrdenActiva();
        if (ordenVerification[0]) {
            return 'No es posible crear la orden debido a que ya existe una orden activa o por entregar';
        }

        const modelos = await getModelos();

        const placeholders = modelos.map(() => '?').join(', ');
        const query = `INSERT INTO orden (estado, recibido, ${modelos.join(', ')}, Usuario_creacion) VALUES ('Por entregar', 'no', ${placeholders}, ?)`;
        
        // Extraer los valores de ordenData en el orden de los modelos
        const values = modelos.map(modelo => ordenData[modelo] || 0); 
        values.push(ordenData.Usuario_creacion); // Añadir `Usuario_creacion` al final de `values`

        await connection.execute(query, values);
        return 'Se registró la orden';
    } finally {
        connection.release();
    }
};


// Función para actualizar una orden existente de forma dinámica
const updateOrden = async (id, ordenData) => {
    const connection = await pool.getConnection();
    try {
        const assignments = modelos.map(modelo => `${modelo} = ?`).join(', ');
        const query = `UPDATE orden SET ${assignments} WHERE id = ? AND estado = 'Por entregar'`;
        
        // Extraemos los valores de ordenData en el orden de los modelos
        const values = modelos.map(modelo => ordenData[modelo] || 0); // Asigna 0 si no existe en ordenData
        
        await connection.execute(query, [...values, id]);
        return 'Se actualizó la orden';
    } finally {
        connection.release();
    }
};

// Función para obtener la orden activa o "Por entregar"
const getOrdenActiva = async () => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute(`SELECT * FROM orden WHERE estado = 'Por entregar' OR estado = 'Activa'`);
        return results;
    } finally {
        connection.release();
    }
};

const getONUsOrden = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute(`SELECT * FROM ONU WHERE orden_id = ?`, [id]);
        return results;
    } finally {
        connection.release();
    }
};

// Función para activar una orden
const activarOrden = async (username) => {
    console.log(username)
    const connection = await pool.getConnection();
    try {
        console.log("hola")
        const [results] = await connection.execute(`SELECT * FROM orden WHERE estado = 'Por entregar' OR estado = 'Activa'`);
        await connection.execute(`UPDATE orden SET estado='Activa', recibido='si', Usuario_soporte_acepto= ? WHERE id = ?`, [username, results[0].id]);
        return { message: 'Soporte y Almacen quedaron de acuerdo en que la cantidad de ONUs entregada coincide con la orden' };
    } finally {
        connection.release();
    }
};

// Función para terminar una orden
const terminarOrden = async (username) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute(`SELECT * FROM orden WHERE estado = 'Por entregar' OR estado = 'Activa'`);
        await connection.execute(`UPDATE orden SET estado='Terminada', Usuario_soporte_termino=? WHERE id = ?`, [username, results[0].id]);
        return { message: 'Orden terminada' };
    } finally {
        connection.release();
    }
};

// Función para marcar una orden como recogida
const recogerOrden = async (id, username) => {
    const connection = await pool.getConnection();
    try {
        await connection.execute(`UPDATE orden SET Fecha_recogido=CURRENT_TIMESTAMP, Usuario_recogio = ?  WHERE id = ?`, [username, id]);
        return { message: 'Orden marcada como recogida' };
    } finally {
        connection.release();
    }
};

const getOrdenes = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute(`SELECT id, estado, Total_ONUs, Fecha_inicio, Fecha_finalizado, Fecha_recogido, Usuario_creacion, Usuario_recogio, Usuario_soporte_acepto, Usuario_soporte_termino   FROM orden ORDER BY id DESC`);
        return results;
    } finally {
        connection.release();
    }
};

const getOrden = async (id) => {
    const connection = await pool.getConnection();
    try {
        const [results] = await connection.execute(`SELECT * FROM orden WHERE id = ${id}`);
        return results;
    } finally {
        connection.release();
    }
};



module.exports = {
    postOrden,
    updateOrden,
    getOrdenActiva,
    activarOrden,
    terminarOrden,
    recogerOrden,
    getONUsOrden,
    getOrdenes,
    getOrden
};
