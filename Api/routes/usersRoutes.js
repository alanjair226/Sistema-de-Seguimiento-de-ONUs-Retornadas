// routes/usersRoutes.js
const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

router.post('/login', usersController.authenticateUser); // Ruta para autenticación
router.get('/:username', usersController.getUsersByUsername);

module.exports = router;
