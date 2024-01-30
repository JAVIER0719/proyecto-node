//llamamos modulos
const express = require('express')
const router = express.Router()

//llamamos archivos
const connection = require('../connection')
var auth = require('../services/authentication.js')
var checkRole= require('../services/checkRole.js')


router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
    let product = req.body;
    var query = "insert into product (name, categoryId, description, price, status) values (?,?,?,?,'true')";
    connection.query(query, [product.name, product.categoryId, product.description, product.price],(err, results)=>{
        if(!err){
        return res.status(200).json({message: "product added successfully."});
        }else{
            return res.status(500).json(err)
        }
    })
})

router.get('/get', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
    var query = "select P.id, P.name, P.description, P.price, P.status, C.name AS categoryname from product AS P inner join category as C where p.categoryId=C.id"
    connection.query(query,(err, result)=>{
        if(!err){
            return res.status(200).json(result);
            }else{
                return res.status(500).json(err)
            }
    })
})

router.get('/getByCategory/:id', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
    const id =req.params.id;
    var query= "select id, name from product where categoryId=? and status='true'";//debe estar activo
    connection.query(query,[id], (err, result)=>{
        if(!err){
            return res.status(200).json(result);
            }else{
                return res.status(500).json(err)
            }
    })
})

//solo me trae un registro
router.get('/getById/:id', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
    const id =req.params.id;
    var query= "select id, name, description, price from product where id=?";//debe estar activo
    connection.query(query,[id], (err, result)=>{
        if(!err){
            return res.status(200).json(result)[0];
            }else{
                return res.status(500).json(err)
            }
    })
})
router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query, [id], (err, result)=>{
        if(!err){
            if(result.affectedRows == 0){
                return res.status(404).json({message: "product Id not found."});
            }
            return res.status(200).json({message: "product delete succesfully."});
            
            }else{
                return res.status(500).json(err)
            }
    })
})
router.patch('/update', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
    let product = req.body;
    var query="update product set name=?, categoryId=?,  description=?, price=? where id=?";
    connection.query(query,[product.name, product.categoryId, product.description, product.price, product.id],(err, results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message: "product Id not found."});
            }
            return res.status(200).json({message: "product update succesfully."});
            
            }else{
                return res.status(500).json(err)
            }
    })
})



router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole, (req, res)=>{
    let product = req.body;
    var query = "update product set status=? where id=?";
    connection.query(query, [product.status, product.id], (err, result)=>{
        if(!err){
            if(result.affectedRows == 0){
                return res.status(404).json({message: "product status not found."});
            }
            return res.status(200).json({message: "product status update  succesfully."});
            }else{
                return res.status(500).json(err)
            }
    })
})



module.exports=router