'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Venta, { foreignKey: 'usuarioId' })
    }
  }
  Usuario.init({
    nombre: DataTypes.STRING,
    email: DataTypes.STRING,
    edad: DataTypes.INTEGER,
    password: DataTypes.STRING,
    rol: {
      type: DataTypes.ENUM('admin', 'moderador', 'cliente'),
      allowNull: false,
      defaultValue: 'cliente'
    }
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};