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
  app.get('/onus/ultimasONUS', async (req, res) => {
    try {
        const ONUs = await databaseService.getUltimasONUs();
        res.json(ONUs);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ONUs', error: error.message });
    }
});
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
    const { SN, motivoId, modeloId } = req.body;
    if (!SN || !motivoId) {
        return res.status(400).json({ message: 'SN y motivoId son requeridos' });
    }
    try {
        const response = await databaseService.registerONU(SN, motivoId, 'usuario general', modeloId );
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

app.post('/onus/almacenar', async (req, res) => {
    const { SN, motivoId } = req.body;
    if (!SN || !motivoId) {
        return res.status(400).json({ message: 'SN y motivoId son requeridos' });
    }
    try {
        const response = await databaseService.almacenarONU(SN, motivoId, 'usuario general');
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al almacenar la ONU', error: error.message });
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
app.get('/modelos', async (req, res) => {
    try {
        const motivos = await databaseService.getModelos();
        res.json(motivos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los modelos', error: error.message });
    }
});

app.get('/onus/sinmotivo/estado', async (req, res) => {
    try {
        const ONUs = await databaseService.getSinMotivoEstatus();
        res.json(ONUs);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ONUs', error: error.message });
    }
});

app.post('/motivoestado', async (req, res) => {
    const { SN, motivo } = req.body;
    if (!SN || !motivo) {
        return res.status(400).json({ message: 'SN y motivo son requeridos' });
    }
    try {
        const response = await databaseService.postMotivoEstado(SN, motivo);
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar motivo', error: error.message });
    }
});

app.post('/orden', async (req, res) => {
    const { Huawei_V5 = 0, Huawei_A5_H5 = 0, TpLink_G3V_Negro = 0, TpLink_XC220 = 0, Nokia = 0, Otros = 0 } = req.body;

    // Verificar que al menos una ONU tenga un valor distinto de 0
    if (Huawei_V5 === 0 && Huawei_A5_H5 === 0 && TpLink_G3V_Negro === 0 && TpLink_XC220 === 0 && Nokia === 0 && Otros === 0) {
        return res.status(400).json({ message: 'Debe haber al menos una ONU en la orden' });
    }

    try {
        const response = await databaseService.postOrden(Huawei_V5, Huawei_A5_H5, TpLink_G3V_Negro, TpLink_XC220, Nokia, Otros);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar motivo', error: error.message });
    }
});

app.get('/orden', async (req, res) => {
    try {
        const Orden = await databaseService.getOrden();
        res.json(Orden);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden', error: error.message });
    }
});

app.patch('/orden/activar', async (req, res) => {
    try {
        const Orden = await databaseService.activarOrden();
        res.json(Orden);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la orden', error: error.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://http://0.0.0.0/:${port}`);
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
