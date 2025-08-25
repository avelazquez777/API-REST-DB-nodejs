const express = require('express');
const router = express.Router();
const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
} = require('../controllers/users.controller');

const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', verifyToken, getUsuarios);
router.get('/:id', verifyToken, getUsuarioById);
router.post('/', verifyToken, isAdmin, createUsuario);
router.put('/:id', verifyToken, isAdmin, updateUsuario);
router.delete('/:id', verifyToken, isAdmin, deleteUsuario);

module.exports = router;