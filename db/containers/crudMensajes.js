class Container {
  constructor(mongoDB, userModel, mensajeModel) {
    this.mongoDB = mongoDB;
    this.userModel = userModel;
    this.mensajeModel = mensajeModel;
  }

  async createMensaje(idOwner, mensaje) {
    let docUser = false;

    docUser = await this.userModel.findOne({ _id: idOwner }, { __v: 0 });

    if (docUser) {
      let date = new Date();

      let newMensaje = {
        timestamp: date,
        usuario: docUser.username,
        email: docUser.email,
        idOwner: docUser._id,
        mensaje: mensaje,
      };

      const addMensaje = new this.mensajeModel(newMensaje);

      this.mongoDB
        .then((_) => addMensaje.save())
        .then((document) => console.log(document))
        .catch((err) => console.log(`Error: ${err.message}`));

      return addMensaje;
    } else {
      throw Error(`Error al acceder al usuario`);
    }
  }

  async getById(user) {
    try {
      console.log(user);
      let docMessages = [];
      docMessages = await this.mensajeModel.find({ idOwner: user._id }, { __v: 0 });

      if (docMessages) {
        return docMessages;
      } else {
        return false;
      }
    } catch (error) {
      throw Error(`Error mensajes no encontrados`);
    }
  }
}
module.exports = Container;
