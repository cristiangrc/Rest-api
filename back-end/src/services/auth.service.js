const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
require('dotenv').config();

// Claves fijas para desarrollo (usar variables de entorno en producción)
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_fija_para_desarrollo_123!';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'clave_refresh_secreta_fija_456!';

const generateTokens = (user) => {
  try {
    // Validación de datos del usuario
    if (!user || !user.id || !user.role) {
      throw new Error('Datos de usuario incompletos para generar token');
    }

    // Token de acceso (15 minutos de duración)
    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
        iat: Math.floor(Date.now() / 1000) // Fecha de emisión
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    // Token de refresco (7 días de duración)
    const refreshToken = jwt.sign(
      {
        id: user.id,
        iat: Math.floor(Date.now() / 1000)
      },
      REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error al generar tokens:', {
      error: error.message,
      userId: user?.id
    });
    throw new Error('Error al generar tokens de autenticación');
  }
};

const register = async (userData) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username: userData.username },
          { email: userData.email }
        ]
      }
    });
    
    if (existingUser) {
      throw new Error('El usuario o email ya existe');
    }
    
    // Crear nuevo usuario
    const user = await User.create(userData);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

const login = async (username, password) => {
  try {
    // Buscar usuario
    const user = await User.findOne({ 
      where: { username } 
    });
    
    // Validar credenciales
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Credenciales inválidas');
    }
    
    // Generar tokens
    const tokens = generateTokens(user);
    
    // Actualizar token de refresco en la BD
    await user.update({ refresh_token: tokens.refreshToken });
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      ...tokens
    };
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

const refreshToken = async (token) => {
  try {
    // Buscar usuario por token de refresco
    const user = await User.findOne({ 
      where: { refresh_token: token } 
    });
    
    if (!user) {
      throw new Error('Refresh token inválido');
    }
    
    // Verificar token de refresco
    jwt.verify(token, REFRESH_SECRET);
    
    // Generar nuevos tokens
    const tokens = generateTokens(user);
    
    // Actualizar token de refresco en la BD
    await user.update({ refresh_token: tokens.refreshToken });
    
    return tokens;
  } catch (error) {
    console.error('Error al refrescar token:', error);
    throw new Error(error.name === 'TokenExpiredError' ? 'Refresh token expirado' : 'Refresh token inválido');
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  generateTokens 
};