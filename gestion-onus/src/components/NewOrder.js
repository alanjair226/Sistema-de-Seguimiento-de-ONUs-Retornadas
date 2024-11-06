import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewOrder = () => {
    const [models, setModels] = useState([]);
    const [formData, setFormData] = useState({});
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/modelos`);
                const modelsData = await response.json();

                const sortedModels = modelsData.sort((a, b) => {
                    if (a.nombre === "Otros") return 1;
                    if (b.nombre === "Otros") return -1;
                    return a.nombre.localeCompare(b.nombre);
                });

                setModels(sortedModels);

                const initialFormData = {};
                sortedModels.forEach(model => {
                    initialFormData[model.nombre] = 0;
                });
                setFormData(initialFormData);
            } catch (error) {
                console.error('Error fetching models:', error);
            }
        };

        fetchModels();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: parseInt(value, 10)
        }));
    };

    const handleLogin = async () => {
        try {
            const loginResponse = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const loginData = await loginResponse.json();

            if (loginData.authenticated) {
                const userResponse = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/users/${username}`);
                const userData = await userResponse.json();

                if (userData[0]?.tipo === 'a') {
                    setShowLoginModal(false);
                    createOrder(username); // Aquí pasamos el username al crear la orden
                } else {
                    setErrorMessage('No tienes permisos para crear una orden');
                }
            } else {
                setErrorMessage('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error en la autenticación:', error);
            setErrorMessage('Error en la autenticación');
        }
    };

    const createOrder = async (creatorUsername) => { 
        try {
            const orderData = {
                ...formData,
                Usuario_creacion: creatorUsername 
            };

            

            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (response.ok) {
                alert('Orden creada con éxito');
                navigate('/');
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error al crear la orden');
            
        }
    };

    const handleOpenModal = () => {
        setShowLoginModal(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Crear Nueva Orden</h1>
            <form onSubmit={(e) => e.preventDefault()} className="bg-white p-4 rounded-lg shadow-md">
                {models.map(model => (
                    <div key={model.id} className="mb-4">
                        <label className="block font-semibold mb-1" htmlFor={model.nombre}>
                            {model.nombre}:
                        </label>
                        <input
                            type="number"
                            id={model.nombre}
                            name={model.nombre}
                            value={formData[model.nombre] || 0}
                            onChange={handleChange}
                            min="0"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleOpenModal}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Crear Orden
                </button>
            </form>

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
                        {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
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

export default NewOrder;
