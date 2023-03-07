const express = require('express');
const app = express();

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const passport = require('passport');
const dotenv = require('dotenv');
dotenv.config();
const log4js = require('./utils/logs.js');
const MongoStore = require(`connect-mongo`);
const session = require('express-session');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// import path from 'path';
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.URL_MONGODB,
      ttl: 10,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: parseInt(process.env.TIME_EXPIRATION) },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT;

app.set(`views`, `./views`);
app.set(`view engine`, `ejs`);

// ------------------------------------------------------------------------------
//  SOCKET
// ------------------------------------------------------------------------------

// io.on('connection', async (socket) => {
//   console.log('Un cliente se ha conectado');

//   socket.on('onload', async () => {
//     const mensajes = 'hola';
//     io.sockets.emit('mensajes', mensajes);
//   });

//   socket.on('new-message', async (newMessage) => {
//     await miContenedorMensajes.save(newMessage);
//     const mensajes = await miContenedorMensajes.getAll();
//     io.sockets.emit('mensajes', mensajes);
//   });
// });

const loggerConsole = log4js.getLogger(`default`);
const loggerArchiveWarn = log4js.getLogger(`warnArchive`);

//Loggers
app.use((req, res, next) => {
  loggerConsole.info(`
    Ruta requerida: ${req.originalUrl}
    Metodo ${req.method}`);
  next();
});

/* Middleware para comprobar si el usuario esta loggeado */
const isLogged = (req, res, next) => {
  let msgError = `Para acceder a esta URL debe iniciar sesión`;
  if (req.user) {
    next();
  } else {
    return res.render('viewError', { msgError });
  }
};
//ROUTES
const productsRouter = require(`./routes/productsRouter`);
const carritoRouter = require(`./routes/cartRouter`);
const chatRouter = require(`./routes/chatRouter`);
const { loginRouter } = require(`./routes/userRouter`);
const { signupRouter } = require(`./routes/userRouter`);
const { logoutRouter } = require(`./routes/userRouter`);
const { profileRouter } = require(`./routes/userRouter`);
const generalViewsRouter = require(`./routes/generalViewsRouter`);
const ordenesRouter = require(`./routes/ordenesRouter`);

app.use(`/`, generalViewsRouter);
app.use(`/api/productos`, isLogged, productsRouter);
app.use(`/api/carrito`, isLogged, carritoRouter);
app.use(`/api/chat`, isLogged, chatRouter);
app.use(`/api/ordenes`, isLogged, ordenesRouter);
app.use(`/login`, loginRouter);
app.use(`/signup`, signupRouter);
app.use('/logout', isLogged, logoutRouter);
app.use(`/profile`, isLogged, profileRouter);

// app.use((req, res) => {
//   loggerConsole.warn(`
//     Estado: 404
//     Ruta requerida: ${req.originalUrl}
//     Metodo ${req.method}`);

//   loggerArchiveWarn.warn(`Estado: 404, Ruta consultada: ${req.originalUrl}, Metodo ${req.method}`);
//   const msgError = `Estado: 404, Ruta consultada: ${req.originalUrl}, Metodo ${req.method}`;

//   res.render(`viewError`, { msgError });
// });

const CLUSTER = Boolean(process.env.CLUSTER);

const runServer = (PORT) => {
  httpServer.listen(PORT, () => loggerConsole.debug(`Servidor corriendo en el puerto ${PORT}`));
};

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  socket.emit('mi mensaje', 'Este es mi mensaje desde el servidor');
});

if (CLUSTER) {
  if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on(`exit`, (worker, code, signal) => {
      cluster.fork();
    });
  } else {
    runServer(PORT);
  }
} else {
  runServer(PORT);
}
