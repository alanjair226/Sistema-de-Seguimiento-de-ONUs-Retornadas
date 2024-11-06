import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ModifyOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Huawei_V5: 0,
        Huawei_A5_H5: 0,
        TpLink_G3V_Negro: 0,
        TpLink_XC220: 0,
        Nokia: 0,
        TpLink_G3_Negro: 0,
        TpLink_G3_Blanco: 0,
        VSOL: 0,
        ZTE: 0,
        Otros: 0,
    });

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden/${id}`);
                const [orderData] = await response.json();
                setFormData(orderData);
            } catch (error) {
                console.error('Error fetching order:', error);
                alert('Error al cargar la orden.');
            }
        };
        fetchOrderData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: parseInt(value, 10) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Orden actualizada con éxito.');
                navigate('/');
            } else {
                alert('Error al actualizar la orden.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error en la solicitud.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Modificar Orden</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                {Object.keys(formData).map((field) => (
                    <div key={field} className="mb-4">
                        <label htmlFor={field} className="block text-gray-700 font-semibold mb-2">
                            {field.replace('_', ' ')}:
                        </label>
                        <input
                            type="number"
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            min="0"
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                ))}
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full">
                    Modificar Orden
                </button>
            </form>
        </div>
    );
};

export default ModifyOrder;
