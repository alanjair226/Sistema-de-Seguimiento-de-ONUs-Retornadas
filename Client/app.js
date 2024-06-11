document.addEventListener('DOMContentLoaded', async () => {
    const snInput = document.getElementById('sn');
    const verifyButton = document.getElementById('verifyButton');
    const disposeButton = document.getElementById('disposeButton');
    const resultMessage = document.getElementById('resultMessage');
    const historyMessage = document.getElementById('historyMessage');
    const motivosSelect = document.getElementById('motivosSelect');
    const url = 'http://192.168.0.1:3000';

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

    // Función para cargar los motivos desde el backend
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

    // Llama a la función para cargar los motivos al cargar el DOM
    await loadMotivos();

    verifyButton.addEventListener('click', async () => {
        const sn = snInput.value.trim();
        const motivoId = motivosSelect.value;
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
                body: JSON.stringify({ SN: sn, motivoId: motivoId })
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
                body: JSON.stringify({ SN: sn, motivoId: motivoId })
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
});
