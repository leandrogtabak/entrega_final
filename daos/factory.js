const ProductosDAOMongoDB = require(`./products/ProductsDAOMongoDB`);
const CarritoDAOMongoDB = require(`./carts/CartDAOMongoDB`);
const OrdenesDAOMongoDB = require(`./orders/OrdersDAOMongoDB`);
const MensajesDAOMongoDB = require('./mensajes/MensajesDAOMongoDB');

const getStorage = () => {
  const storage = process.env.STORAGE;

  switch (storage) {
    case `MongoDB`:
      return {
        productos: new ProductosDAOMongoDB(),
        carrito: new CarritoDAOMongoDB(),
        ordenes: new OrdenesDAOMongoDB(),
        mensaje: new MensajesDAOMongoDB(),
      };
      break;

    default:
      return {
        productos: new ProductosDAOMongoDB(),
        carrito: new CarritoDAOMongoDB(),
        ordenes: new OrdenesDAOMongoDB(),
        mensaje: new MensajesDAOMongoDB(),
      };
      break;
  }
};

module.exports = getStorage;
