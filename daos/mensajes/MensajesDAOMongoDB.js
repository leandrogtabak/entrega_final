const mongoDB = require(`../../db/options/mongoDB`);

const mensajeModel = require(`../../db/models/mensaje`);
const userModel = require(`../../db/models/user`);

const CrudMongoDB = require(`../../db/containers/crudMensajes`);

class MensajesDAOMongoDB extends CrudMongoDB {
  constructor() {
    super(mongoDB, userModel, mensajeModel);
  }
}

module.exports = MensajesDAOMongoDB;
