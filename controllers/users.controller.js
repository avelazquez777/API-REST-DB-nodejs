const { Usuario } = require('../models');

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ['password'] } 
        });
        res.json({ status: 200, data: usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ 
            status: 500, 
            message: 'Error al obtener usuarios', 
            error: error.message 
        });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: { exclude: ['password'] } 
        });
        if (!usuario) {
            return res.status(404).json({ 
                status: 404, 
                message: 'Usuario no encontrado' 
            });
        }
        res.json({ status: 200, data: usuario });
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ 
            status: 500, 
            message: 'Error al obtener usuario', 
            error: error.message 
        });
    }
};

const createUsuario = async (req, res) => {
    res.status(400).json({ 
        status: 400, 
        message: 'Usar /auth/register para crear nuevos usuarios' 
    });
};

const updateUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ 
                status: 404, 
                message: 'Usuario no encontrado' 
            });
        }

        const { nombre, email, edad, rol } = req.body;

        if (email && email !== usuario.email) {
            const emailExists = await Usuario.findOne({ where: { email } });
            if (emailExists) {
                return res.status(400).json({
                    status: 400,
                    message: 'El email ya está en uso por otro usuario'
                });
            }
        }

        if (rol && !['admin', 'moderador', 'cliente'].includes(rol)) {
            return res.status(400).json({
                status: 400,
                message: 'Rol inválido. Debe ser: admin, moderador o cliente'
            });
        }

        if (nombre !== undefined) usuario.nombre = nombre.trim();
        if (email !== undefined) usuario.email = email.toLowerCase().trim();
        if (edad !== undefined) {
            const edadNum = Number(edad);
            if (edadNum < 1 || edadNum > 120) {
                return res.status(400).json({
                    status: 400,
                    message: 'La edad debe estar entre 1 y 120 años'
                });
            }
            usuario.edad = edadNum;
        }
        if (rol !== undefined) usuario.rol = rol;

        await usuario.save();

        const userResponse = {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            edad: usuario.edad,
            rol: usuario.rol
        };

        res.status(200).json({ 
            status: 200, 
            message: 'Usuario editado exitosamente', 
            data: userResponse 
        });
    } catch (error) {
        console.error('Error al editar usuario:', error);
        res.status(500).json({ 
            status: 500, 
            message: 'Error al editar usuario', 
            error: error.message 
        });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ 
                status: 404, 
                message: 'Usuario no encontrado' 
            });
        }

        if (req.user && req.user.id === usuario.id) {
            return res.status(400).json({
                status: 400,
                message: 'No puedes eliminar tu propia cuenta'
            });
        }

        await usuario.destroy();

        res.status(200).json({ 
            status: 200, 
            message: 'Usuario eliminado exitosamente' 
        });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ 
            status: 500, 
            message: 'Error al eliminar usuario', 
            error: error.message 
        });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario
};