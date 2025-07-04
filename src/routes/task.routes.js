const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { verifyToken, verifyRole, verifyTaskOwnership } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.get('/', taskController.getAllTasks);
router.get('/:id', verifyTaskOwnership, taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', verifyTaskOwnership, taskController.updateTask);
router.delete('/:id', verifyTaskOwnership, taskController.deleteTask);

// Ruta solo para admin
router.get('/admin/all', verifyRole(['admin']), taskController.getAllTasks);

module.exports = router;