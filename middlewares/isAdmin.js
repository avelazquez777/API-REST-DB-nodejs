const isAdmin = (req, res, next) => {
    console.log('req.user:', req.user) // <--- esto te dirá qué llega
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado: se requiere rol admin' })
    }
    next()
}

module.exports = isAdmin