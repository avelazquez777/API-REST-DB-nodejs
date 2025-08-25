const { Sequelize } = require('sequelize')


const sequelize = new Sequelize('crud_db', 'root', 'Root751862934@', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize