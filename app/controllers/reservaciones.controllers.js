const db = require('../config/db.config.js');
const Reservacion = db.Reservacion; // Asegúrate de que Reservacion esté correctamente exportado en db.config.js

// Crear una nueva reservación
exports.create = (req, res) => {
  let reservacion = {
    ID_CLIENTE: req.body.ID_CLIENTE,
    TIPO_CLIENTE: req.body.TIPO_CLIENTE,
    FECHA_RESERVA: req.body.FECHA_RESERVA,
    HORA_RESERVA: req.body.HORA_RESERVA,
    DIAS_RESERVA: req.body.DIAS_RESERVA,
    ESTADO_CANCELACION: req.body.ESTADO_CANCELACION,
    TOTAL: req.body.TOTAL,
    COMENTARIO: req.body.COMENTARIO
  };

  Reservacion.create(reservacion)
    .then(result => {
      res.status(200).json({
        message: "Reservación creada con éxito con id = " + result.ID_RESERVACIONES,
        reservacion: result,
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "¡Falló!",
        error: error.message
      });
    });
};

// Obtener todas las reservaciones
exports.retrieveAllReservaciones = (req, res) => {
  Reservacion.findAll()
    .then(reservacionInfos => {
      res.status(200).json({
        message: "¡Se obtuvieron todas las reservaciones con éxito!",
        reservaciones: reservacionInfos
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "¡Error!",
        error: error
      });
    });
};

// Obtener reservación por ID
exports.getReservacionById = (req, res) => {
  let reservacionId = req.params.id;
  Reservacion.findByPk(reservacionId)
    .then(reservacion => {
      if (reservacion) {
        res.status(200).json({
          message: "Se obtuvo con éxito la reservación con id = " + reservacionId,
          reservacion: reservacion
        });
      } else {
        res.status(404).json({
          message: "No se encontró la reservación con id = " + reservacionId,
          error: "404"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "¡Error!",
        error: error
      });
    });
};

// Actualizar reservación por ID
exports.updateById = async (req, res) => {
  try {
    let reservacionId = req.params.id;
    let reservacion = await Reservacion.findByPk(reservacionId);

    if (!reservacion) {
      res.status(404).json({
        message: "No se encontró la reservación para actualizar con id = " + reservacionId,
        reservacion: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        ID_CLIENTE: req.body.ID_CLIENTE,
        TIPO_CLIENTE: req.body.TIPO_CLIENTE,
        FECHA_RESERVA: req.body.FECHA_RESERVA,
        HORA_RESERVA: req.body.HORA_RESERVA,
        DIAS_RESERVA: req.body.DIAS_RESERVA,
        ESTADO_CANCELACION: req.body.ESTADO_CANCELACION,
        TOTAL: req.body.TOTAL,
        COMENTARIO: req.body.COMENTARIO
      };
      let result = await Reservacion.update(updatedObject, { returning: true, where: { ID_RESERVACIONES: reservacionId } });

      if (!result[0]) {
        res.status(500).json({
          message: "Error -> No se puede actualizar la reservación con id = " + reservacionId,
          error: "No se pudo actualizar",
        });
      }

      res.status(200).json({
        message: "Actualización exitosa de la reservación con id = " + reservacionId,
        reservacion: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar la reservación con id = " + req.params.id,
      error: error.message
    });
  }
};

// Eliminar reservación por ID
exports.deleteById = async (req, res) => {
  try {
    let reservacionId = req.params.id;
    let reservacion = await Reservacion.findByPk(reservacionId);

    if (!reservacion) {
      res.status(404).json({
        message: "No existe una reservación con id = " + reservacionId,
        error: "404",
      });
    } else {
      await reservacion.destroy();
      res.status(200).json({
        message: "Eliminación exitosa de la reservación con id = " + reservacionId,
        reservacion: reservacion,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede eliminar la reservación con id = " + req.params.id,
      error: error.message,
    });
  }
};
