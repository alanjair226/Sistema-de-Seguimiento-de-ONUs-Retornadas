document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'http://localhost:3000/onus/sinmotivo/estado';
    const insertUrl = 'http://localhost:3000/motivoestado';

    // Función para cargar los datos y crear las tablas
    function loadTableData() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const desechadoTableBody = document.querySelector('#desechadoTable tbody');
                const almacenTableBody = document.querySelector('#almacenTable tbody');
                desechadoTableBody.innerHTML = ''; // Limpiar la tabla
                almacenTableBody.innerHTML = ''; // Limpiar la tabla

                data.forEach(item => {
                    const row = document.createElement('tr');

                    const snCell = document.createElement('td');
                    snCell.textContent = item.SN;
                    row.appendChild(snCell);

                    const motivoCell = document.createElement('td');
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'motivo-input';
                    motivoCell.appendChild(input);
                    row.appendChild(motivoCell);

                    const actionCell = document.createElement('td');
                    const button = document.createElement('button');
                    button.textContent = 'Insertar';
                    button.addEventListener('click', () => insertMotivo(item.SN, input.value));
                    actionCell.appendChild(button);
                    row.appendChild(actionCell);

                    if (item.estado === 'desechado') {
                        desechadoTableBody.appendChild(row);
                    } else if (item.estado === 'almacen') {
                        almacenTableBody.appendChild(row);
                    }
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Función para insertar el motivo del estado
    function insertMotivo(sn, motivo) {
        if (motivo.trim() === '') {
            alert('Por favor, ingrese un motivo.');
            return;
        }

        fetch(insertUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ SN: sn, motivo: motivo })
        })
        .then(response => {
            if (response.ok) {
                alert('Motivo insertado correctamente.');
                loadTableData(); // Recargar los datos después de insertar
            } else {
                alert('Error al insertar el motivo.');
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Cargar los datos al cargar la página
    loadTableData();
});