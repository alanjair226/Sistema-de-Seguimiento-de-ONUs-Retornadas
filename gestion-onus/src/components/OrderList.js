import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [reload, setReload] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden/list`);
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert('Hubo un error al obtener las órdenes.');
            }
        };
        fetchOrders();
    }, [reload]);

    const viewOrder = (id) => navigate(`/order/${id}`);
    const modifyOrder = (id) => navigate(`/modify_order/${id}`);

    const recogerOrden = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden/recoger`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (response.ok) {
                setOrders(prev => prev.map(order => (order.id === id ? { ...order, estado: 'Recogida' } : order)));
                alert('Orden recogida exitosamente.');
                setReload(!reload);
            } else {
                alert('Error al recoger la orden.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">ORDENES DE REVISION DE ONUs</h1>
            <button onClick={() => navigate('/new_order')} className="bg-blue-500 text-white py-2 px-4 rounded mb-4 hover:bg-blue-600">
                Nueva Orden
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="py-3 px-4 border">ID</th>
                            <th className="py-3 px-4 border">Estado</th>
                            <th className="py-3 px-4 border">Total ONUs</th>
                            <th className="py-3 px-4 border">Fecha Inicio</th>
                            <th className="py-3 px-4 border">Fecha Finalizado</th>
                            <th className="py-3 px-4 border">Fecha Recogido</th>
                            <th className="py-3 px-4 border">Creado por</th>
                            <th className="py-3 px-4 border">Aceptado por</th>
                            <th className="py-3 px-4 border">Terminado por</th>
                            <th className="py-3 px-4 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="text-center border-b hover:bg-gray-100">
                                <td className="py-2 px-4">{order.id}</td>
                                <td className="py-2 px-4">{order.estado}</td>
                                <td className="py-2 px-4">{order.Total_ONUs}</td>
                                <td className="py-2 px-4">{order.Fecha_inicio ? new Date(order.Fecha_inicio).toLocaleString() : 'N/A'}</td>
                                <td className="py-2 px-4">{order.Fecha_finalizado ? new Date(order.Fecha_finalizado).toLocaleString() : 'N/A'}</td>
                                <td className="py-2 px-4">{order.Fecha_recogido ? new Date(order.Fecha_recogido).toLocaleString() : 'N/A'}</td>
                                <td className="py-2 px-4">{order.Usuario_creacion ? order.Usuario_creacion : 'N/A'}</td>
                                <td className="py-2 px-4">{order.Usuario_soporte_acepto ? order.Usuario_soporte_acepto : 'N/A'}</td>
                                <td className="py-2 px-4">{order.Usuario_soporte_termino ? order.Usuario_soporte_acepto : 'N/A'}</td>
                                <td className="py-2 px-4 space-x-2">
                                    <button onClick={() => viewOrder(order.id)} className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">
                                        Consultar
                                    </button>
                                    {order.estado === 'Terminada' && !order.Fecha_recogido && (
                                        <button onClick={() => recogerOrden(order.id)} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                                            Recoger
                                        </button>
                                    )}
                                    {order.estado === 'Por entregar' && (
                                        <button onClick={() => modifyOrder(order.id)} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">
                                            Modificar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
