//variables de entorno ocultas...
require('dotenv').config();
//conexion http es configuracion que se require
const http = require('http');
const app = require('./index.js');

const server = http.createServer(app);
//escuchamos el servidor por el puerto
server.listen(process.env.PORT);

/*herramientas*/
/*express, mysql, dotenv, cors, nodemon
jsonwebtoken, nodemailer

//utilizar la opcion de cripto
//require(cripto).randomBytes('puede variar 128, 64, 204').toString('hex')


*/