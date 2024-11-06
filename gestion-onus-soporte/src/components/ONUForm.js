import React, { useState } from 'react';

const ONUForm = ({ motivos, modelos, handleVerify, handleDispose, handleStore, message, status, history }) => {
    const [sn, setSn] = useState('');
    const [motivoId, setMotivoId] = useState('');
    const [modeloId, setModeloId] = useState('');

    return (
        <div className="lg:col-span-2 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Gestión de ONUs</h2>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Introduce el SN"
                    value={sn}
                    onChange={(e) => setSn(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select 
                    value={motivoId} 
                    onChange={(e) => setMotivoId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Selecciona un motivo</option>
                    {motivos.map((motivo) => (
                        <option key={motivo.id} value={motivo.id}>{motivo.descripcion}</option>
                    ))}
                </select>
                <select 
                    value={modeloId} 
                    onChange={(e) => setModeloId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="">Selecciona un modelo</option>
                    {modelos.map((modelo) => (
                        <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
                    ))}
                </select>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <button onClick={() => handleVerify(sn, motivoId, modeloId)} className="w-full md:w-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Verificar/Registrar ONU</button>
                    <button onClick={() => handleDispose(sn, motivoId, modeloId)} className="w-full md:w-auto bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Desechar ONU</button>
                    <button onClick={() => handleStore(sn, motivoId, modeloId)} className="w-full md:w-auto bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Almacenar ONU</button>
                </div>
                {message && (
                    <div className={`p-3 rounded mt-4 ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                {history && (
                    <div className="mt-4 p-3 bg-blue-100 text-blue-700 rounded">
                        {history}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ONUForm;
