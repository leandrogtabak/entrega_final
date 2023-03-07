const storage = require(`../daos/factory`); //Tiene acceso a la base de datos para crear, editar o borrar datos

const mensajesStorage = storage().mensaje;

const viewChat = async (req, res) => {
  userLog = req.user;

  try {
    let mensajesById = await mensajesStorage.getById(userLog);

    if (mensajesById.length == 0) {
      return res.render(`chat`, { mensajesById });
    } else {
      return res.render(`chat`, { mensajesById });
    }
  } catch (err) {
    return res.status(404).json({
      error: `Error al intentar acceder a un id de un usuario ${err}`,
    });
  }
};

const addMessage = async (req, res) => {
  try {
    userLog = req.user;
    const mensaje = req.body.mensaje;

    await mensajesStorage.createMensaje(userLog, mensaje);

    return res.redirect('/api/chat');
  } catch (err) {
    return res.status(404).json({
      error: `Error al enviar mensaje ${err}`,
    });
  }
};

module.exports = {
  viewChat,
  addMessage,
};
