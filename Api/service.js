const express = require('express');
const bodyParser = require('body-parser');
const databaseService = require('./databaseService');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());
// Rutas
app.get('/', (req, res) => {
    res.send('Sistema de Seguimiento de ONUs Retornadas')
    console.log('heloo')
  })

app.get('/onus/:sn', async (req, res) => {
    const { sn } = req.params;
    try {
        const result = await databaseService.getONUBySN(sn);
        if (!result) {
            res.status(404).json({ message: 'ONU no encontrada' });
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la ONU', error: error.message });
    }
});

app.post('/onus', async (req, res) => {
    const { SN, motivoId } = req.body;
    if (!SN || !motivoId) {
        return res.status(400).json({ message: 'SN y motivoId son requeridos' });
    }
    try {
        const response = await databaseService.registerONU(SN, motivoId, 'usuario general');
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la ONU', error: error.message });
    }
});

app.post('/onus/desechar', async (req, res) => {
    const { SN, motivoId } = req.body;
    if (!SN || !motivoId) {
        return res.status(400).json({ message: 'SN y motivoId son requeridos' });
    }
    try {
        const response = await databaseService.desecharONU(SN, motivoId, 'usuario general');
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al desechar la ONU', error: error.message });
    }
});

app.get('/onus/:sn/motivos', async (req, res) => {
    const { sn } = req.params;
    try {
        const result = await databaseService.getMotivosBySN(sn);
        if (!result) {
            res.status(404).json({ message: 'ONU no encontrada' });
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los motivos de la ONU', error: error.message });
    }
});

app.get('/motivos', async (req, res) => {
    try {
        const motivos = await databaseService.getMotivos();
        res.json(motivos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los motivos', error: error.message });
    }
});



app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://http://10.131.91.205/:${port}`);
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
