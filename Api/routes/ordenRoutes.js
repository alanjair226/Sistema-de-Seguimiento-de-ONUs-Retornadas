const express = require('express');
const ordenController = require('../controllers/ordenController');
const router = express.Router();

router.post('/', ordenController.postOrden);
router.put('/:id', ordenController.updateOrden);
router.get('/', ordenController.getOrdenActiva);
router.get('/list', ordenController.getOrdenes);
router.get('/:id', ordenController.getOrden);
router.get('/onus/:id', ordenController.getONUsOrden);
router.patch('/activar', ordenController.activarOrden);
router.patch('/terminar', ordenController.terminarOrden);
router.patch('/recoger', ordenController.recogerOrden);

module.exports = router;
