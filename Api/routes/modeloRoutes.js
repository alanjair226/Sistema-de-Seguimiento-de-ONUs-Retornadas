const express = require('express');
const modeloController = require('../controllers/modeloController');
const router = express.Router();

router.get('/', modeloController.getModelos); 

module.exports = router;
