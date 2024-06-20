document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.querySelector('#ultimasONUsTable tbody');

    // Realizar la solicitud GET utilizando fetch
    fetch('http://localhost:3000/onus/ultimasONUS')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Limpiar el cuerpo de la tabla
            tableBody.innerHTML = '';

            // Iterar sobre los datos y agregar filas a la tabla
            data.forEach(item => {
                let row = `<tr>
                    <td>${item.SN}</td>
                    <td>${item.estado}</td>
                    <td>${item.Motivo_estado}</td>
                    <td>${new Date(item.fecha).toLocaleString()}</td>
                </tr>`;
                tableBody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
});
