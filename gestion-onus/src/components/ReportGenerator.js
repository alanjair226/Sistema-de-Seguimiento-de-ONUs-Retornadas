import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ReportGenerator = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const formatFechaMX = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const downloadReport = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_URL_API_GESTION}/report?startDate=${startDate}&endDate=${endDate}`,
                { method: 'GET' }
            );

            if (response.ok) {
                const reportData = await response.json();

                const workbook = new ExcelJS.Workbook();
                const generalSheet = workbook.addWorksheet("General");

                // Encabezado del reporte general
                const titleRow = generalSheet.addRow(["Reporte General"]);
                titleRow.font = { name: 'Comic Sans MS', size: 18, bold: true, color: { argb: 'FF3E7A' } };
                titleRow.alignment = { horizontal: 'center' };
                generalSheet.mergeCells(`A1:D1`);

                // Encabezados de los totales
                generalSheet.addRow([]);
                const headerRow1 = generalSheet.addRow(["Total ONUs", "Almacenadas", "Desechadas"]);
                headerRow1.font = { bold: true, size: 12, color: { argb: 'FFFFFF' } };
                headerRow1.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7B00' } };
                headerRow1.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7B00' } };
                headerRow1.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF7B00' } };
                headerRow1.alignment = { horizontal: 'center' };

                const totalsRow = generalSheet.addRow([
                    reportData.general.total_onus, 
                    reportData.general.almacenadas, 
                    reportData.general.desechadas
                ]);
                totalsRow.alignment = { horizontal: 'center' };
                
                // Espacio entre secciones
                generalSheet.addRow([]);

                // Encabezados para la tabla por día
                const headerRow2 = generalSheet.addRow(["Fecha", "Total", "Almacenadas", "Desechadas"]);
                headerRow2.font = { bold: true, color: { argb: 'FFFFFF' } };
                headerRow2.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3E8E7A' } };
                headerRow2.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3E8E7A' } };
                headerRow2.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3E8E7A' } };
                headerRow2.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3E8E7A' } };
                headerRow2.alignment = { horizontal: 'center' };

                // Agregar datos diarios con colores alternados
                Object.keys(reportData.porDia).forEach((date, index) => {
                    const dailyData = reportData.porDia[date];
                    const row = generalSheet.addRow([
                        formatFechaMX(date),
                        dailyData.total,
                        dailyData.almacenadas,
                        dailyData.desechadas
                    ]);

                    // Alternar color de fondo en las celdas con datos, sin colorear toda la fila
                    const bgColor = index % 2 === 0 ? 'D6EAF8' : 'FDEDEC';
                    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                    row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                    row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                    row.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };

                    row.eachCell((cell) => {
                        cell.border = { 
                            top: { style: 'thin' }, 
                            left: { style: 'thin' }, 
                            bottom: { style: 'thin' }, 
                            right: { style: 'thin' } 
                        };
                        cell.alignment = { horizontal: 'center' };
                    });
                });

                // Ajustar ancho de columnas
                generalSheet.columns = [
                    { width: 15 }, // Fecha
                    { width: 12 }, // Total
                    { width: 15 }, // Almacenadas
                    { width: 15 }  // Desechadas
                ];

                // Crear la hoja para los datos de cada modelo
                const modelsSheet = workbook.addWorksheet("Modelos");

                // Encabezado de los modelos
                const modelsTitleRow = modelsSheet.addRow(["Modelos"]);
                modelsTitleRow.font = { name: 'Comic Sans MS', size: 18, bold: true, color: { argb: 'FF3E7A' } };
                modelsTitleRow.alignment = { horizontal: 'center' };
                modelsSheet.mergeCells(`A1:C1`);

                const modelsHeaderRow = modelsSheet.addRow(["Modelo", "Almacenadas", "Desechadas"]);
                modelsHeaderRow.font = { bold: true, color: { argb: 'FFFFFF' } };
                modelsHeaderRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3E7A8E' } };
                modelsHeaderRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3E7A8E' } };
                modelsHeaderRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '3E7A8E' } };
                modelsHeaderRow.alignment = { horizontal: 'center' };

                // Agregar datos de cada modelo con colores alternados
                Object.keys(reportData.por_modelo).forEach((modelo, index) => {
                    const row = modelsSheet.addRow([
                        modelo, 
                        reportData.por_modelo[modelo].almacenadas, 
                        reportData.por_modelo[modelo].desechadas
                    ]);

                    const bgColor = index % 2 === 0 ? 'FCF3CF' : 'FDEBD0';
                    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                    row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
                    row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };

                    row.eachCell((cell) => {
                        cell.border = { 
                            top: { style: 'thin' }, 
                            left: { style: 'thin' }, 
                            bottom: { style: 'thin' }, 
                            right: { style: 'thin' } 
                        };
                        cell.alignment = { horizontal: 'center' };
                    });
                });

                // Ajustar ancho de columnas en la hoja de modelos
                modelsSheet.columns = [
                    { width: 20 }, // Modelo
                    { width: 15 }, // Almacenadas
                    { width: 15 }  // Desechadas
                ];

                // Exportar el archivo Excel
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveAs(blob, `Reporte_ONUs_${startDate}_to_${endDate}.xlsx`);
            } else {
                alert('Error al generar el reporte');
            }
        } catch (error) {
            console.error('Error al descargar el reporte:', error);
            alert('Hubo un error al generar el reporte.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Generar Reporte de ONUs</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Fecha de Inicio:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold mb-2">Fecha de Fin:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    onClick={downloadReport}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
                >
                    Descargar Reporte
                </button>
            </div>
        </div>
    );
};

export default ReportGenerator;
