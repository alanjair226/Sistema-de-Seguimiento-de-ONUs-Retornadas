import React, { useRef } from 'react';

const ONUTable = ({ desechado, almacen, loadTableData }) => {
    const inputRefs = useRef({});

    const insertMotivo = async (sn) => {
        const motivo = inputRefs.current[sn]?.value;
        if (!motivo || !motivo.trim()) {
            alert('Por favor, ingrese un motivo.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/motivos/estado`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ SN: sn, motivo }),
            });
            if (response.ok) {
                alert('Motivo insertado correctamente.');
                loadTableData();
                inputRefs.current[sn].value = '';
            } else {
                alert('Error al insertar el motivo.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="table-container w-full max-w-6xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lista de ONUs sin Motivo Desechado</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">SN</th>
                        <th className="py-2 px-4 border-b">Motivo por el que se desecha</th>
                        <th className="py-2 px-4 border-b">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {desechado.map((item) => (
                        <tr key={item.SN} className="text-center border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{item.SN}</td>
                            <td className="py-2 px-4">
                                <input
                                    type="text"
                                    placeholder="Escribe el motivo"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    ref={(el) => (inputRefs.current[item.SN] = el)}
                                />
                            </td>
                            <td className="py-2 px-4">
                                <button
                                    onClick={() => insertMotivo(item.SN)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                >
                                    Insertar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4">Lista de ONUs sin Motivo Almacen</h2>
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">SN</th>
                        <th className="py-2 px-4 border-b">Motivo por el que se almacena</th>
                        <th className="py-2 px-4 border-b">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {almacen.map((item) => (
                        <tr key={item.SN} className="text-center border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{item.SN}</td>
                            <td className="py-2 px-4">
                                <input
                                    type="text"
                                    placeholder="Escribe el motivo"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    ref={(el) => (inputRefs.current[item.SN] = el)}
                                />
                            </td>
                            <td className="py-2 px-4">
                                <button
                                    onClick={() => insertMotivo(item.SN)}
                                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                                >
                                    Insertar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ONUTable;
