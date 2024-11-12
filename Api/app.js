const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const onusRoutes = require('./routes/onusRoutes');
const ordersRoutes = require('./routes/ordenRoutes');
const motivoRoutes = require('./routes/motivoRoutes');
const usersRoutes = require('./routes/usersRoutes');
const modeloRoutes = require('./routes/modeloRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Sistema de Seguimiento de ONUs Retornadas');
});

app.use('/onus', onusRoutes);
app.use('/orden', ordersRoutes);
app.use('/motivos', motivoRoutes);
app.use('/users', usersRoutes);
app.use('/modelos', modeloRoutes);
app.use('/report', reportRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost/:${port}`);
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await databaseService.closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await databaseService.closePool();
    process.exit(0);
});
