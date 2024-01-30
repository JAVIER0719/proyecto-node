//llamamos modulos
const express = require('express')
const router = express.Router()

//llamamos archivos
const connection = require('../connection')
var auth = require('../services/authentication.js')
var checkRole= require('../services/checkRole.js')



//solo agregamos la categoria
router.post('/add', auth.authenticateToken, checkRole.checkRole,(req, res,next)=>{
    let category = req.body;//traer los datos del usuairo 
    var query = "INSERT INTO category (name) VALUES (?)";
    connection.query(query,[category.name],(err, results)=>{
        if(!err){
            return res.status(200).json({message:"category added successfully."})
        }else{
            return res.status(500).json(err)
        }
    })
})


router.get('/get', auth.authenticateToken, (req, res,next)=>{
 var query ="select *from category order by name"; //se ordenara en base a el nombre
    connection.query(query,(err, result)=>{
        if(!err){
            return res.status(200).json(result);
        }else{
            return res.status(500).json(err);
        }
    })

})


router.patch('/update', auth.authenticateToken, checkRole.checkRole,(req, res,next)=>{
    let producto = req.body;//traer el cuerpo de la consulta
    var query ="update category set name=? where id=?";
    connection.query(query,[producto.name, producto.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"category not found"})
            }

            return res.status(200).json({message:"category apdate successfully"})

        }else{
            return res.status(500).json(err)
        }
    })

})


module.exports=router;


