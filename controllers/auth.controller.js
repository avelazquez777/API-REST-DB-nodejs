const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const register = async (req, res) => {
    console.log("Datos recibidos en register:", req.body);

    const { nombre, email, edad, password, rol } = req.body;

    try {
        // Validar campos obligatorios
        if (!nombre || !email || !edad || !password) {
            return res.status(400).json({ 
                message: 'Todos los campos son obligatorios (nombre, email, edad, password)' 
            });
        }

        const userExist = await Usuario.findOne({ where: { email } });
        if (userExist) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Usuario.create({
            nombre,
            email,
            edad,
            password: hashedPassword,
            rol: rol || 'cliente'
        });

        // No devolver la contraseña hasheada
        const userResponse = {
            id: newUser.id,
            nombre: newUser.nombre,
            email: newUser.email,
            edad: newUser.edad,
            rol: newUser.rol
        };

        res.status(201).json({ 
            message: 'Usuario registrado exitosamente', 
            data: userResponse 
        });
    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({ 
            status: 500, 
            message: 'Error al crear el usuario', 
            error: error.message 
        });
    }
};

const login = async (req, res) => {
    console.log("Datos que llegan al backend en login:", req.body);
    
    const { email, password } = req.body;

    try {
        // Validar campos obligatorios
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email y contraseña son obligatorios' 
            });
        }

        console.log("Buscando usuario con email:", email);
        
        const userExist = await Usuario.findOne({ where: { email } });
        
        if (!userExist) {
            console.log("Usuario no encontrado");
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        console.log("Usuario encontrado:", {
            id: userExist.id,
            email: userExist.email,
            rol: userExist.rol
        });

        console.log("Verificando contraseña...");
        const validPassword = await bcrypt.compare(password, userExist.password);
        
        if (!validPassword) {
            console.log("Contraseña incorrecta");
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        console.log("Contraseña válida, generando token...");

        const user = {
            id: userExist.id,
            nombre: userExist.nombre,
            email: userExist.email,
            edad: userExist.edad,
            rol: userExist.rol
        };

        const token = jwt.sign({ user: user }, 'secreto1234', { expiresIn: '1h' });

        console.log("Login exitoso para:", email);

        res.json({ 
            message: 'Inicio de sesion exitoso', 
            token,
            user: user // Agregar datos del usuario en la respuesta
        });

    } catch (error) {
        console.error('Error en login:', error);
        console.error('Stack trace:', error.stack);
        
        res.status(500).json({ 
            status: 500, 
            message: 'Error interno del servidor', 
            error: error.message 
        });
    }
};

module.exports = { register, login };