// controllers/usersController.js
const usersService = require('../services/usersService');

const authenticateUser = async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: 'Username y password son requeridos' });
    }

    try {
        const isAuthenticated = await usersService.authenticateUser(username, password);
        res.json({ authenticated: isAuthenticated });
    } catch (error) {
        res.status(500).json({ message: 'Error en la autenticación', error: error.message });
    }
};

const getUsersByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const users = await usersService.getUsersByUsername(username);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

module.exports = {
    authenticateUser,
    getUsersByUsername,
};
