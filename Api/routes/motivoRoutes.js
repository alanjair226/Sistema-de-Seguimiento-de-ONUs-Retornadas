// routes/motivoRoutes.js
const express = require('express');
const motivoController = require('../controllers/motivoController');
const router = express.Router();

router.get('/', motivoController.getMotivos);
router.post('/estado', motivoController.postMotivoEstado);


module.exports = router;
