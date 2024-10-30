const db = require('../config/db.config.js');
const Habitacion = db.Habitacion; // Asegúrate de que Habitacion esté correctamente exportado en db.config.js

// Crear una nueva habitación
exports.create = (req, res) => {
  let habitacion = {
    ID_SERVICIO: req.body.ID_SERVICIO,
    NUM_HABITACION: req.body.NUM_HABITACION,
    TIPO_HABITACION: req.body.TIPO_HABITACION,
    NUMERO_CAMAS: req.body.NUMERO_CAMAS,
    TIPO_DE_CAMA: req.body.TIPO_DE_CAMA,
    ESTADO: req.body.ESTADO,
    PRECIO: req.body.PRECIO,
    DESCUENTO: req.body.DESCUENTO,
    DESCRIPCION: req.body.DESCRIPCION
  };

  Habitacion.create(habitacion)
    .then(result => {
      res.status(200).json({
        message: "Habitación creada con éxito con id = " + result.ID_HABITACION,
        habitacion: result,
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "¡Falló!",
        error: error.message
      });
    });
};

// Obtener todas las habitaciones
exports.retrieveAllHabitaciones = (req, res) => {
  Habitacion.findAll()
    .then(habitacionInfos => {
      res.status(200).json({
        message: "¡Se obtuvieron todas las habitaciones con éxito!",
        habitaciones: habitacionInfos
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "¡Error!",
        error: error
      });
    });
};

// Obtener habitación por ID
exports.getHabitacionById = (req, res) => {
  let habitacionId = req.params.id;
  Habitacion.findByPk(habitacionId)
    .then(habitacion => {
      if (habitacion) {
        res.status(200).json({
          message: "Se obtuvo con éxito la habitación con id = " + habitacionId,
          habitacion: habitacion
        });
      } else {
        res.status(404).json({
          message: "No se encontró la habitación con id = " + habitacionId,
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

// Actualizar habitación por ID
exports.updateById = async (req, res) => {
  try {
    let habitacionId = req.params.id;
    let habitacion = await Habitacion.findByPk(habitacionId);

    if (!habitacion) {
      res.status(404).json({
        message: "No se encontró la habitación para actualizar con id = " + habitacionId,
        habitacion: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        ID_SERVICIO: req.body.ID_SERVICIO,
        NUM_HABITACION: req.body.NUM_HABITACION,
        TIPO_HABITACION: req.body.TIPO_HABITACION,
        NUMERO_CAMAS: req.body.NUMERO_CAMAS,
        TIPO_DE_CAMA: req.body.TIPO_DE_CAMA,
        ESTADO: req.body.ESTADO,
        PRECIO: req.body.PRECIO,
        DESCUENTO: req.body.DESCUENTO,
        DESCRIPCION: req.body.DESCRIPCION
      };
      let result = await Habitacion.update(updatedObject, { returning: true, where: { ID_HABITACION: habitacionId } });

      if (!result[0]) {
        res.status(500).json({
          message: "Error -> No se puede actualizar la habitación con id = " + habitacionId,
          error: "No se pudo actualizar",
        });
      }

      res.status(200).json({
        message: "Actualización exitosa de la habitación con id = " + habitacionId,
        habitacion: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar la habitación con id = " + req.params.id,
      error: error.message
    });
  }
};

// Eliminar habitación por ID
exports.deleteById = async (req, res) => {
  try {
    let habitacionId = req.params.id;
    let habitacion = await Habitacion.findByPk(habitacionId);

    if (!habitacion) {
      res.status(404).json({
        message: "No existe una habitación con id = " + habitacionId,
        error: "404",
      });
    } else {
      await habitacion.destroy();
      res.status(200).json({
        message: "Eliminación exitosa de la habitación con id = " + habitacionId,
        habitacion: habitacion,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede eliminar la habitación con id = " + req.params.id,
      error: error.message,
    });
  }
};
