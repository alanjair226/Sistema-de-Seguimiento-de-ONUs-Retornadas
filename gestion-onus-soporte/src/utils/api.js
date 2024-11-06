import React, { useEffect, useState } from 'react';
import OrderDetails from './components/OrderDetails';
import ONUForm from './components/ONUForm';
import ONUTable from './components/ONUTable';

const App = () => {
    const [order, setOrder] = useState(null);
    const [motivos, setMotivos] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [history, setHistory] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const fetchOrder = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/orden`);
            const data = await response.json();
            setOrder(data[0]);
        } catch (error) {
            console.error('Error al cargar la orden:', error);
        }
    };

    const fetchMotivos = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/motivos`);
            const data = await response.json();
            setMotivos(data);
        } catch (error) {
            console.error('Error al cargar los motivos:', error);
        }
    };

    const fetchModelos = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/modelos`);
            const data = await response.json();
            setModelos(data);
        } catch (error) {
            console.error('Error al cargar los modelos:', error);
        }
    };

    const fetchHistory = async (sn) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/onus/${sn}/motivos`);
            const data = await response.json();
            setHistory(data.motivos || 'No hay motivos registrados');
        } catch (error) {
            setHistory('Error al obtener el historial de la ONU');
        }
    };

    const handleVerify = async (sn, motivoId, modeloId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/onus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ SN: sn, motivoId, modeloId }),
            });
            const data = await response.json();
            setMessage(data.message);
            setStatus(response.ok ? 'success' : 'danger');
            fetchOrder();
            fetchHistory(sn);
        } catch (error) {
            setMessage('Error al registrar la ONU');
            setStatus('danger');
        }
    };

    const handleDispose = async (sn, motivoId, modeloId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/onus/desechar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ SN: sn, motivoId, modeloId }),
            });
            const data = await response.json();
            setMessage(data.message);
            setStatus(response.ok ? 'success' : 'danger');
            fetchOrder();
            fetchHistory(sn);
        } catch (error) {
            setMessage('Error al desechar la ONU');
            setStatus('danger');
        }
    };

    const handleStore = async (sn, motivoId, modeloId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_URL_API_GESTION}/onus/almacenar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ SN: sn, motivoId, modeloId }),
            });
            const data = await response.json();
            setMessage(data.message);
            setStatus(response.ok ? 'success' : 'danger');
            fetchOrder();
            fetchHistory(sn);
        } catch (error) {
            setMessage('Error al almacenar la ONU');
            setStatus('danger');
        }
    };

    useEffect(() => {
        fetchOrder();
        fetchMotivos();
        fetchModelos();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
    <h1 className="text-3xl font-bold mb-6 text-blue-800">Gestión de ONUs</h1>
    <div className="main-container grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        <OrderDetails order={order} fetchOrder={fetchOrder} />

            <ONUForm
                motivos={motivos}
                modelos={modelos}
                handleVerify={handleVerify}
                handleDispose={handleDispose}
                handleStore={handleStore}
                message={message}
                status={status}
                history={history}
            />

    </div>
    <ONUTable />
</div>

    );
};

export default App;
