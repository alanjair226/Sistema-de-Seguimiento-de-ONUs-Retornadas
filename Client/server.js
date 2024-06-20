const express = require('express');
const path = require('path');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
