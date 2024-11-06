// services/usersService.js
const mysql = require('mysql2/promise');
const pool = require('../config/database');

const authenticateUser = async (username, password) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('SELECT * FROM `users` WHERE `username` = ? AND `password` = ?', [username, password]);
            return result.length > 0; // Devuelve true si hay coincidencia, false si no
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al autenticar al usuario:', error);
        throw error;
    }
};

const getUsersByUsername = async (username) => {
    try {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute('SELECT * FROM `users` WHERE `username` = ?', [username]);
            return result;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error al obtener usuarios por tipo:', error);
        throw error;
    }
};

module.exports = {
    authenticateUser,
    getUsersByUsername,
};
