import React, { useState } from 'react';

const OrderDetails = ({ order, fetchOrder }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [action, setAction] = useState('');

    const handleLogin = async () => {
        try {
            const loginResponse = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const loginData = await loginResponse.json();

            if (loginData.authenticated) {
                const userResponse = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/users/${username}`);
                const userData = await userResponse.json();

                if (userData[0]?.tipo === 's') {
                    if (action === 'activate') {
                        await activateOrder(username);
                    } else if (action === 'finish') {
                        await finishOrder(username);
                    }
                    setShowLoginModal(false);
                } else {
                    alert('No tienes permisos para realizar esta acción');
                }
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error en la autenticación:', error);
            alert('Error en la autenticación');
        }
    };

    const activateOrder = async (username) => {
        try {
            await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden/activar`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            alert('La orden ha sido activada');
            fetchOrder();
        } catch (error) {
            alert('Error al activar la orden');
        }
    };

    const finishOrder = async (username) => {
        try {
            await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden/terminar`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            alert('La orden ha sido terminada');
            fetchOrder();
        } catch (error) {
            alert('Error al terminar la orden');
        }
    };

    const handleOpenModal = (actionType) => {
        setAction(actionType);
        setShowLoginModal(true);
    };

    // Filtrar los modelos dinámicamente de `order`
    const ignoredFields = [
        'id', 'estado', 'recibido', 'Usuario_creacion', 'Usuario_soporte_acepto', 
        'Usuario_soporte_termino', 'Fecha_inicio', 'Fecha_finalizado', 
        'Fecha_recogido', 'Total_ONUs', 'Usuario_recogio'
    ];
    const modelos = Object.keys(order || {}).filter(key => !ignoredFields.includes(key));

    return (
        <div className="order-container p-6 bg-white shadow-lg rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Detalles de la Orden</h2>
            {order ? (
                <div className="space-y-2">
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Estado:</strong> {order.estado}</p>
                    <p className=' pb-4'><strong>Recibido:</strong> {order.recibido ? 'Sí' : 'No'}</p>
                    
                    {/* Renderizar los modelos dinámicamente */}
                    {modelos.map(modelo => (
                        order[modelo] !== 0 && (
                            <p key={modelo}><strong>{modelo}:</strong> {order[modelo]}</p>
                        )
                    ))}

                    <p className='pt-4'><strong>Total ONUs:</strong> {order.Total_ONUs}</p>
                    
                    {order.estado === 'Por entregar' && (
                        <button
                            className="bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-600"
                            onClick={() => handleOpenModal('activate')}
                        >
                            Aceptar
                        </button>
                    )}
                    {order.estado === 'Activa' && (
                        <button
                            className="bg-green-500 text-white mt-4 py-2 px-4 rounded hover:bg-green-600"
                            onClick={() => handleOpenModal('finish')}
                        >
                            Terminar
                        </button>
                    )}
                </div>
            ) : (
                <p>No hay una orden activa actualmente.</p>
            )}

            {showLoginModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-80">
                        <h3 className="text-lg font-semibold mb-4">Ingrese sus credenciales</h3>
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full mb-3 p-2 border rounded"
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mb-4 p-2 border rounded"
                        />
                        <button
                            onClick={handleLogin}
                            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
                        >
                            Iniciar sesión
                        </button>
                        <button
                            onClick={() => setShowLoginModal(false)}
                            className="mt-2 text-red-500 w-full"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
