//importamos los modulos
const mysql = require ('mysql')
require('dotenv').config()


//hacemos la conexion
var connection = mysql.createConnection({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
});

//verificamos conexion
connection.connect((err)=>{
    if(!err){
        console.log("connected")
    }else{
        console.log("Error", err)
    }
});

//sacamos la conexion para recibirla
//en otro lado
module.exports=connection;

