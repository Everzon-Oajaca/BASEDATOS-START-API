const express = require('express');
const router = express.Router();
const reservaciones = require('../controllers/reservaciones.controllers'); // Asegúrate de que el archivo reservaciones.controller.js esté en la ubicación correcta

// Crear una reservación
router.post('/api/reservaciones/create', reservaciones.create);
router.post('/create', reservaciones.create); // Alternativa sin el prefijo 'api/reservaciones'

// Obtener todas las reservaciones
router.get('/api/reservaciones/all', reservaciones.retrieveAllReservaciones);
router.get('/reservaciones/all', reservaciones.retrieveAllReservaciones);

// Obtener una reservación por su ID
router.get('/api/reservaciones/onebyid/:id', reservaciones.getReservacionById);

// Actualizar una reservación por su ID
router.put('/api/reservaciones/update/:id', reservaciones.updateById);

// Eliminar una reservación por su ID
router.delete('/api/reservaciones/delete/:id', reservaciones.deleteById);

module.exports = router;
