const reportService = require('../services/reportService');

const getReportByDate = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const report = await reportService.getReportByDate(startDate, endDate);
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el reporte', error: error.message });
    }
};

module.exports = {
    getReportByDate,
};
