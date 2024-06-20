document.addEventListener('DOMContentLoaded', async () => {
    const snInput = document.getElementById('sn');
    const verifyButton = document.getElementById('verifyButton');
    const disposeButton = document.getElementById('disposeButton');
    const storeButton = document.getElementById('storeButton');
    const resultMessage = document.getElementById('resultMessage');
    const historyMessage = document.getElementById('historyMessage');
    const motivosSelect = document.getElementById('motivosSelect');
    const modelosSelect = document.getElementById('modelosSelect');
    const orderDetails = document.getElementById('orderDetails');
    const url = 'http://localhost:3000';

    const showMessage = (element, message, type) => {
        element.className = `alert ${type}`;
        element.textContent = message;
        element.style.display = 'block';
    };

    const hideMessage = (element) => {
        element.style.display = 'none';
    };

    const fetchHistory = async (sn) => {
        try {
            const response = await fetch(`${url}/onus/${sn}/motivos`);
            const data = await response.json();
            if (response.ok) {
                showMessage(historyMessage, `Historial: ${data.motivos || 'No hay motivos registrados'}`, 'info');
            } else {
                showMessage(historyMessage, data.message, 'danger');
            }
        } catch (error) {
            showMessage(historyMessage, 'Error al obtener el historial de la ONU', 'danger');
        }
    };

    const loadOrder = async () => {
        try {
            const response = await fetch(`${url}/orden`);
            const [order] = await response.json(); // Asumimos que siempre recibimos un array con una sola orden
            if (order) {
                orderDetails.innerHTML = `
                    <p><strong>ID:</strong> ${order.id}</p>
                    <p><strong>Estado:</strong> ${order.estado}</p>
                    <p><strong>Recibido:</strong> ${order.recibido}</p>
                    <p><strong>Huawei V5:</strong> ${order.Huawei_V5}</p>
                    <p><strong>Huawei A5 H5:</strong> ${order.Huawei_A5_H5}</p>
                    <p><strong>TpLink G3V Negro:</strong> ${order.TpLink_G3V_Negro}</p>
                    <p><strong>TpLink XC220:</strong> ${order.TpLink_XC220}</p>
                    <p><strong>Nokia:</strong> ${order.Nokia}</p>
                    <p><strong>Otros:</strong> ${order.Otros}</p>
                    <p><strong>Total ONUs:</strong> ${order.Total_ONUs}</p>
                `;
                if (order.estado === 'Por entregar') {
                    const notice = document.createElement('p');
                    notice.textContent = 'REVISAR QUE LA CANTIDAD DE MODEMS QUE ENTREGA ALMACEN CORRESPONDAN A LAS QUE MUESTRA LA ORDEN Y DAR ANTES DE ACEPTAR LA ORDEN';
                    orderDetails.appendChild(notice);

                    const acceptButton = document.createElement('button');
                    acceptButton.textContent = 'Aceptar';
                    acceptButton.className = 'btn btn-primary';
                    acceptButton.id = 'acceptOrderButton';
                    orderDetails.appendChild(acceptButton);

                    acceptButton.addEventListener('click', async () => {
                        try {
                            const response = await fetch(`${url}/orden/activar`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                            const data = await response.json();
                            if (response.ok) {
                                alert(data.message);
                                await loadOrder();
                            } else {
                                alert('Error: ' + data.message);
                            }
                        } catch (error) {
                            alert('Error al activar la orden');
                        }
                    });
                }
            } else {
                orderDetails.innerHTML = '<p>Por el momento no hay ONUs que revisar.</p>';
            }
        } catch (error) {
            orderDetails.innerHTML = '<p>Por el momento no hay ONUs que revisar.</p>';
            console.error('Error al cargar la orden:', error);
        }
    };

    const loadMotivos = async () => {
        try {
            const response = await fetch(`${url}/motivos`);
            const motivos = await response.json();
            motivos.forEach(motivo => {
                const option = document.createElement('option');
                option.value = motivo.id;
                option.textContent = motivo.descripcion;
                motivosSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar los motivos:', error);
        }
    };

    const loadModelos = async () => {
        try {
            const response = await fetch(`${url}/modelos`);
            const modelos = await response.json();
            modelos.forEach(modelo => {
                const option = document.createElement('option');
                option.value = modelo.id;
                option.textContent = modelo.nombre;
                modelosSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar los modelos:', error);
        }
    };

    await loadMotivos();
    await loadModelos();
    await loadOrder();

    verifyButton.addEventListener('click', async () => {
        const sn = snInput.value.trim();
        const motivoId = motivosSelect.value;
        const modeloId = modelosSelect.value;
        if (!sn) {
            showMessage(resultMessage, 'Por favor, introduce un SN válido.', 'warning');
            return;
        }
        hideMessage(resultMessage);

        try {
            const response = await fetch(`${url}/onus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ SN: sn, motivoId: motivoId, modeloId: modeloId })
            });
            const data = await response.json();
            if (response.ok) {
                showMessage(resultMessage, data.message, 'success');
            } else {
                showMessage(resultMessage, data.message, 'danger');
            }
            await fetchHistory(sn);
        } catch (error) {
            showMessage(resultMessage, 'Error al registrar la ONU', 'danger');
        }
    });

    disposeButton.addEventListener('click', async () => {
        const sn = snInput.value.trim();
        const motivoId = motivosSelect.value;
        const modeloId = modelosSelect.value;
        if (!sn) {
            showMessage(resultMessage, 'Por favor, introduce un SN válido.', 'warning');
            return;
        }
        hideMessage(resultMessage);

        try {
            const response = await fetch(`${url}/onus/desechar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ SN: sn, motivoId: motivoId, modeloId: modeloId })
            });
            const data = await response.json();
            if (response.ok) {
                showMessage(resultMessage, data.message, 'success');
            } else {
                showMessage(resultMessage, data.message, 'danger');
            }
            await fetchHistory(sn);
        } catch (error) {
            showMessage(resultMessage, 'Error al desechar la ONU', 'danger');
        }
    });

    storeButton.addEventListener('click', async () => {
        const sn = snInput.value.trim();
        const motivoId = motivosSelect.value;
        const modeloId = modelosSelect.value;
        if (!sn) {
            showMessage(resultMessage, 'Por favor, introduce un SN válido.', 'warning');
            return;
        }
        hideMessage(resultMessage);

        try {
            const response = await fetch(`${url}/onus/almacenar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ SN: sn, motivoId: motivoId, modeloId: modeloId })
            });
            const data = await response.json();
            if (response.ok) {
                showMessage(resultMessage, data.message, 'success');
            } else {
                showMessage(resultMessage, data.message, 'danger');
            }
            await fetchHistory(sn);
        } catch (error) {
            showMessage(resultMessage, 'Error al almacenar la ONU', 'danger');
        }
    });
});
