const express = require('express');
const path = require('path');
const app = express();
const port = 3003; // Cambia el puerto según lo necesites

// Sirve los archivos estáticos de la carpeta 'build'
app.use(express.static(path.join(__dirname, 'build')));

// Para cualquier otra ruta, devuelve el archivo 'index.html'
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Configura el servidor para escuchar en la IP de la red local y el puerto especificado
app.listen(port, '192.168.5.49', () => {
    console.log(`Servidor escuchando en http://192.168.5.49:${port}`);
});
