const pool = require('../config/database');
const modeloService = require('./modeloService');

const getReportByDate = async (startDate, endDate) => {
    const modelos = await modeloService.getModelos();
    const modelosMap = modelos.reduce((map, modelo) => {
        map[modelo.id] = modelo.nombre;
        return map;
    }, {});

    const query = `
        SELECT 
            DATE(Fecha) AS fecha,
            estado,
            modelo_id,
            COUNT(*) AS cantidad
        FROM ONU
        WHERE Fecha BETWEEN ? AND ?
        GROUP BY fecha, estado, modelo_id;
    `;

    const [rows] = await pool.query(query, [startDate, endDate]);

    const report = {
        general: {
            total_onus: 0,
            almacenadas: 0,
            desechadas: 0
        },
        por_modelo: {},
        porDia: {}
    };

    // Iteramos sobre cada fila de la consulta para llenar los datos por modelo y por día
    rows.forEach(row => {
        const modeloNombre = modelosMap[row.modelo_id] || `Modelo_${row.modelo_id}`;
        const formattedDate = new Date(row.fecha).toISOString().split('T')[0];

        // Inicializamos el objeto por día solo cuando hay registros para esa fecha
        if (!report.porDia[formattedDate]) {
            report.porDia[formattedDate] = {
                total: 0,
                almacenadas: 0,
                desechadas: 0
            };
        }

        // Actualizamos el total general
        report.general.total_onus += row.cantidad;

        // Actualizamos el reporte por modelo
        if (!report.por_modelo[modeloNombre]) {
            report.por_modelo[modeloNombre] = {
                almacenadas: 0,
                desechadas: 0
            };
        }

        if (row.estado === 'almacen') {
            report.general.almacenadas += row.cantidad;
            report.por_modelo[modeloNombre].almacenadas += row.cantidad;
            report.porDia[formattedDate].almacenadas += row.cantidad;
        } else if (row.estado === 'desechado') {
            report.general.desechadas += row.cantidad;
            report.por_modelo[modeloNombre].desechadas += row.cantidad;
            report.porDia[formattedDate].desechadas += row.cantidad;
        }

        // Actualizamos el total diario
        report.porDia[formattedDate].total += row.cantidad;
    });

    return report;
};

module.exports = {
    getReportByDate,
};
