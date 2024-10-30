const db = require('../config/db.config.js');
const Facturacion = db.Facturacion; // Asegúrate de que Facturacion esté correctamente exportado en db.config.js

// Crear una nueva factura
exports.create = (req, res) => {
  let factura = {
    ID_RESERVACION: req.body.ID_RESERVACION,
    FECHA_EMISION: req.body.FECHA_EMISION,
    FECHA_CONSUMO: req.body.FECHA_CONSUMO,
    ESTADO: req.body.ESTADO,
    TOTAL: req.body.TOTAL,
    DESCUENTO: req.body.DESCUENTO,
    IMPUESTO: req.body.IMPUESTO
  };

  Facturacion.create(factura)
    .then(result => {
      res.status(200).json({
        message: "Factura creada con éxito con id = " + result.ID_FACTURA,
        factura: result,
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "¡Falló!",
        error: error.message
      });
    });
};

// Obtener todas las facturas
exports.retrieveAllFacturas = (req, res) => {
  Facturacion.findAll()
    .then(facturaInfos => {
      res.status(200).json({
        message: "¡Se obtuvieron todas las facturas con éxito!",
        facturas: facturaInfos
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "¡Error!",
        error: error
      });
    });
};

// Obtener factura por ID
exports.getFacturaById = (req, res) => {
  let facturaId = req.params.id;
  Facturacion.findByPk(facturaId)
    .then(factura => {
      if (factura) {
        res.status(200).json({
          message: "Se obtuvo con éxito la factura con id = " + facturaId,
          factura: factura
        });
      } else {
        res.status(404).json({
          message: "No se encontró la factura con id = " + facturaId,
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

// Actualizar factura por ID
exports.updateById = async (req, res) => {
  try {
    let facturaId = req.params.id;
    let factura = await Facturacion.findByPk(facturaId);

    if (!factura) {
      res.status(404).json({
        message: "No se encontró la factura para actualizar con id = " + facturaId,
        factura: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        ID_RESERVACION: req.body.ID_RESERVACION,
        FECHA_EMISION: req.body.FECHA_EMISION,
        FECHA_CONSUMO: req.body.FECHA_CONSUMO,
        ESTADO: req.body.ESTADO,
        TOTAL: req.body.TOTAL,
        DESCUENTO: req.body.DESCUENTO,
        IMPUESTO: req.body.IMPUESTO
      };
      let result = await Facturacion.update(updatedObject, { returning: true, where: { ID_FACTURA: facturaId } });

      if (!result[0]) {
        res.status(500).json({
          message: "Error -> No se puede actualizar la factura con id = " + facturaId,
          error: "No se pudo actualizar",
        });
      }

      res.status(200).json({
        message: "Actualización exitosa de la factura con id = " + facturaId,
        factura: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar la factura con id = " + req.params.id,
      error: error.message
    });
  }
};

// Eliminar factura por ID
exports.deleteById = async (req, res) => {
  try {
    let facturaId = req.params.id;
    let factura = await Facturacion.findByPk(facturaId);

    if (!factura) {
      res.status(404).json({
        message: "No existe una factura con id = " + facturaId,
        error: "404",
      });
    } else {
      await factura.destroy();
      res.status(200).json({
        message: "Eliminación exitosa de la factura con id = " + facturaId,
        factura: factura,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede eliminar la factura con id = " + req.params.id,
      error: error.message,
    });
  }
};
