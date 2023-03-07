const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  email: { type: String, required: true },
  usuario: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  mensaje: { type: String, required: true },
  idOwner: { type: Object, require: true },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
