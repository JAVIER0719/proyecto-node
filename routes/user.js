//llamamos modulos
const express = require('express')
const jwt=require('jsonwebtoken');
const nodemailer=require('nodemailer');
const router = express.Router()
//llamamos archivos
const connection = require('../connection')



require('dotenv').config();

//insertar datos
router.post('/signup', (req, res)=>{
    let user = req.body;//traera el require con el body

    //consulta si hay un correo igual a el correo que ya este registrado
    query="select email, password, role, status from users where email=?";//va a ser igual a el tipo de dato ingresado
    //conexion a la base de datos
    //si existe un correo igual que marque error o muestre un resultado
    connection.query(query, [user.email], (err, results)=>{
        //aqui dentro se haran las comparaciones
        if(!err){
            //si es indiferente a error nos deja pasar
/*evalua si se encontro algo igual* */
            if(results.length <=0){
                //si no hay ningun resultado nos permitira hacer la insercion
                query="insert into users(name, contact, email, password, status, role) value(?,?,?,?, 'false', 'user')";//agrego los datos como parametros
                //agrego los datos parametrados o hechos por el usua
                connection.query(query,[user.name, user.contact, user.email, user.password], (err, results)=>{
                    if(!err){
                        /*200 exitoso, 500 error no se dio el proceso, 403 es una alerta, 404 no se a encontrado nada*/
                        return res.status(200).json({message:"successfully registered."})
                    }else{
                        /*200 exitoso, 500 error no se dio el proceso, 403 es una alerta, 404 no se a encontrado nada*/
                        return res.status(500).json(err)
                    }
                })
            }else{
                return res.status(400).json({message: "emaily already exist."})
            }
        } else{
            return res.status(500).json(err)
        }
    })
})
//LOGIN
router.post('/login', (req, res)=>{
    //recibo lo que el usuario escribio
    const user=req.body;
    //consulto si el gmail se repitio ya que este debe de ser unico
    query="select email, password, role, status from users where email=?";//lo pongo parametrado
    //agrego al email del usuario si no hay un error
    connection.query(query, [user.email], (err, results)=>{
        //verifico si hay error
        if(!err){
            //si lo hay me dejara entrar
        if(results.length<=0 || results[0].password != user.password){
            //si es 0 y las password son diferentes me mandara error
            return res.status(401).json({messages:"Incorrect username or password"});//retornara error ya que no son iguales
        }else if(results[0].status === 'false'){
            return res.status(401).json({message:"wait for admin aproval"});
        }else if(results[0].password == user.password){
            //si son iguales
            const response ={email: results[0].email,role: results[0].role};
            //me generara un token cuando inicie sesion con una duracion de 8 horas
            const accessToken = jwt.sign(response, process.env.ACCES_TOKEN, {
                expiresIn: "8h",
            });
            return res.status(200).json({token:accessToken});
        }else{
            return  res.status(400).json({message: "something went. plesar try again later"});
        }
        }else{
            return res.status(500).json(err);
        }
    });
});


var transportar = nodemailer.createTransport({
    //EL SERVICIO QUE SE UTILIZARA
    service:'gmail',
    auth:{
        //EL SOPORTE donde enviaremos todo
        user:process.env.EMAIL,
        pass: process.env.PASS
    }
})

router.post('/forgotpassword', (req, res)=>{
const user= req.body;
//consultamos si el email existe
query="select email, password from users where email=?";
//vemos que el usuario escrito este correcto
connection.query(query,[user.email], (err, result)=>{
    if(!err){
        if(result.length <=0){
            //si es igual mandara error
            return res.status(200).json({messages:"password send succesfuly to you email."})
        }else{
            //si no me dara la estructura de mensaje
            var mailOption = {
                //estructura del correo
                from: process.env.EMAIL,
                to:result[0].email,
                subje:'The chart- recuperación de acceso',
                html:'<p><b>Tus credencialesdel sistema son los siguientes<br/>EMAIL: </b>'+result[0].email+'<br/><b>Clave:</b>'+result[0].password+'<br/><a href="localhost3000">Click para acceder a el sistema</a></p>'
            };
            transportar.sendMail(mailOption, (error, info)=>{
                if(error){
                    console.log(error)
                }else{
                    console.log('Email sent successfuly'+info.response)
                }
            });
            return res.status(200).json({messages:"password send succesfuly to you email."})
        }
    }else{
        return res.status(500).json(err);
    }
})

})



router.get('/get', (req, res)=>{
    //consulta
    var query = "select id, name, email, status, from users where role='user";
    connection.query(query, (err, result)=>{
        if(!err){
            return res.status(200).json(result)
        }else{
            return res.status(500).json(err)
        }
    })
})


router.patch('/update', (req, res)=>{
    let user = req.body
    var query ="update users set status=? where id=?"
    connection.query(query, [user.status, user.id], (err, result)=>{
        if(!err){
            if(result.affectedRows==0){
                return res.status(404).json({message:'User id does not exits.'})
            }
            return res.status(200).json({message:'User updated successfuly'})
        }else{
            return res.status(500).json(err)
        }
    })
})


//chequiar que este activo el usuario
router.get('/checkToken', (req, res)=>{
    return res.status(200).json({message:"true"})
})

module.exports=router;