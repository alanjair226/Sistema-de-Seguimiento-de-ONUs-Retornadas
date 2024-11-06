const express = require('express');
const onusController = require('../controllers/onusController');
const router = express.Router();

router.get('/ultimasONUS', onusController.getUltimasONUs);
router.get('/:sn', onusController.getONUBySN);
router.post('/', onusController.registerONU);
router.post('/desechar', onusController.desecharONU);
router.post('/almacenar', onusController.almacenarONU);
router.get('/:sn/motivos', onusController.getMotivosBySN);
router.get('/sinmotivo/estado', onusController.getSinMotivoEstatus);
router.post('/motivoestado', onusController.postMotivoEstado);

module.exports = router;
