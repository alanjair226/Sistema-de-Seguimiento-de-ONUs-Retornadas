import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [onus, setOnus] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Fetch order details
                const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden/${id}`);
                const orderData = await response.json();
                setOrder(orderData[0]);

                // Fetch ONUs
                const onusResponse = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden/onus/${id}`);
                const onusData = await onusResponse.json();
                setOnus(onusData);

                // Fetch modelos
                const modelosResponse = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/modelos`);
                const modelosData = await modelosResponse.json();
                setModelos(modelosData);

                // Alert if total ONUs doesn't match the listed ONUs count
                if (orderData[0].Total_ONUs !== onusData.length) {
                    setAlertMessage(
                        `Aviso: El total de ONUs en la orden (${orderData[0].Total_ONUs}) no coincide con el número de ONUs listadas (${onusData.length}).`
                    );
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [id]);

    // Function to get the model name by model ID
    const getModelNameById = (id) => {
        const model = modelos.find(modelo => modelo.id === id);
        return model ? model.nombre : 'Desconocido';
    };

    return (
        <div className="container mx-auto p-4">
            {alertMessage && (
                <div className="alert bg-red-100 text-red-700 p-4 mb-4 rounded-md">
                    {alertMessage}
                </div>
            )}
            <h1 className="text-3xl font-bold mb-4">Detalle de Orden</h1>
            {order ? (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Estado:</strong> {order.estado}</p>
                    <p><strong>Total ONUs:</strong> {order.Total_ONUs}</p>
                </div>
            ) : <p>Cargando...</p>}
            <table className="min-w-full bg-white border border-gray-300 rounded-md shadow-md">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="py-2 px-4 border">SN</th>
                        <th className="py-2 px-4 border">Estado</th>
                        <th className="py-2 px-4 border">Veces Instalada</th>
                        <th className="py-2 px-4 border">Motivo Estado</th>
                        <th className="py-2 px-4 border">Modelo</th>
                        <th className="py-2 px-4 border">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {onus.map((onu) => (
                        <tr key={onu.SN} className="text-center border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{onu.SN}</td>
                            <td className="py-2 px-4">{onu.estado}</td>
                            <td className="py-2 px-4">{onu.veces_instalada}</td>
                            <td className="py-2 px-4">{onu.Motivo_estado}</td>
                            <td className="py-2 px-4">{getModelNameById(onu.modelo_id)}</td>
                            <td className="py-2 px-4">{new Date(onu.Fecha).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderDetails;
