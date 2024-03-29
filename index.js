//importamos modulos
const express = require('express');
const cors = require('cors');

//llamamos archivos
const connection =require ('./connection.js');
const user= require('./routes/user.js');
const categoryRoute= require('./routes/category.js');
const productRoute= require('./routes/product.js');
const billRoute= require('./routes/bill.js');


//configuramos los modulos
const app =express();

//llamamos cors para poder tener una configura
//cion base de node.js para poder ejecutar
app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(express.json())
//esto hace una comparacion
app.use('/user', user)
app.use('/category', categoryRoute)
app.use('/product', productRoute)
app.use('/bill', billRoute)



module.exports=app;
