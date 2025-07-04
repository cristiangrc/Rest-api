
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Task = require('../models/task.model');


const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_fija_para_desarrollo_123!';

const verifyToken = (req, res, next) => {
  try {
    // 1. Verificar cabecera de autorización
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Autenticación requerida',
        solution: 'Incluya el header: Authorization: Bearer <token>'
      });
    }

    // 2. Verificar formato Bearer
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ 
        error: 'Formato de token inválido',
        details: 'Debe comenzar con "Bearer " seguido del token',
        received: authHeader.length > 50 ? authHeader.substring(0, 50) + '...' : authHeader
      });
    }

    // 3. Extraer y limpiar el token
    const token = authHeader.split(' ')[1].trim();
    
    // 4. Verificar estructura básica del JWT
    if (!token || token.split('.').length !== 3) {
      return res.status(400).json({ 
        error: 'Token malformado',
        details: 'El token JWT debe tener 3 partes separadas por puntos'
      });
    }

    // 5. Verificar el token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Error de verificación de token:', {
          error: err.name,
          message: err.message,
          tokenSample: token.substring(0, 10) + '...' + token.slice(-10)
        });
        
        return res.status(401).json({
          error: 'Token inválido',
          reason: err.name === 'TokenExpiredError' ? 'Token expirado' : 'Token malformado',
          solution: 'Obtenga un nuevo token mediante /login'
        });
      }

      // Verificar datos mínimos en el token
      if (!decoded.id || !decoded.role) {
        return res.status(401).json({
          error: 'Token incompleto',
          details: 'El token no contiene los datos necesarios (id y role)'
        });
      }

      // Adjuntar datos al request
      req.userId = decoded.id;
      req.userRole = decoded.role;
      next();
    });
  } catch (error) {
    console.error('Error inesperado en verifyToken:', error);
    res.status(500).json({
      error: 'Error de autenticación',
      details: error.message
    });
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(403).json({ 
        error: 'Rol de usuario no definido',
        solution: 'Asegúrese de que verifyToken se ejecute primero'
      });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'Acceso denegado',
        requiredRoles: roles,
        currentRole: req.userRole
      });
    }
    next();
  };
};

const verifyTaskOwnership = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    if (task.user_id !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ 
        error: 'No tienes permiso para esta tarea',
        required: 'Ser el dueño o administrador'
      });
    }

    next();
  } catch (error) {
    console.error('Error en verifyTaskOwnership:', error);
    res.status(500).json({ 
      error: 'Error al verificar la tarea',
      details: error.message
    });
  }
};

module.exports = {
  verifyToken,
  verifyRole,
  verifyTaskOwnership
};