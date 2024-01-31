//llamamos modulos
const express = require('express');
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
let fs = require('fs');
let uuid = require('uuid');

//llamamos archivos
const connection = require('../connection')
var auth = require('../services/authentication.js')

//consulta el reporte
//debe estar autenticado
router.post('/generateReport', auth.authenticateToken,(req, res)=>{
    const generateUuid= uuid.v1();
    const orderDetails= req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);
    query="insert into bill (name, uuid, email, contact, paymentMethod, total, productDetails, createdBy) values (?,?,?,?,?,?,?,?)";
    
    //traetra todo por defecto por el correo con el que inicie sesion
    connection.query(query, [orderDetails.name, generateUuid, orderDetails.email, orderDetails.contact, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results)=>{
        if(!err){
            //se guarda todo los productos en detalle
            ejs.renderFile(path.join(__dirname, '', '../report/report.ejs'), {productDetails:productDetailsReport, name: orderDetails.name, email: orderDetails.email, contact: orderDetails.contact, paymentMethod: orderDetails.paymentMethod,  totalAmount: orderDetails.totalAmount},(err, results)=>{
                if(err){
                    return res.status(500).json(err)
                }else{
                    //crear pdf
                    pdf.create(results).toFile('./generated_pdf/CHART'+generateUuid+'.pdf', function(err, results){
                        if(err){
                            return res.status(500).json(err);
                            }else{
                                return res.status(200).json({uuid: generateUuid})
                            }
                    })
                }

            })
        }else{
            return res.status(500).json(err)
        }
    })
});

router.post('/getPDF', auth.authenticateToken, (req, res)=>{
    const orderDetails = req.body;
    const pdfPath = "./generated_pdf/CHART"+orderDetails.uuid+'.pdf';//recupera el pdf
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }else{
        var productDetailsReport = JSON.parse(orderDetails.productDetails)

        ejs.renderFile(path.join(__dirname, '', '../report/report.ejs'), {productDetails:productDetailsReport, name: orderDetails.name, email: orderDetails.email, contact: orderDetails.contact, paymentMethod: orderDetails.paymentMethod,  totalAmount: orderDetails.totalAmount},(err, results)=>{
            if(err){
                return res.status(500).json(err)
            }else{
                //crear pdf
                pdf.create(results).toFile('./generated_pdf/CHART'+orderDetails.uuid+'.pdf', function(err, results){
                    if(err){
                        return res.status(500).json(err);
                        }else{
                            res.contentType("application/pdf");
                            fs.createReadStream(pdfPath).pipe(res);
                        }
                })
            }

        })
    }
})

//consulta general
router.get('/getBills', auth.authenticateToken, (req, res, next)=>{
    var query= "select * from bill order by id desc";
    connection.query(query, (err, results)=>{
        if(!err){
            return res.status(200).json(results);
        }else{
            return res.status(500).json(err);
        }
    });
});

router.delete('/delete/:id', auth.authenticateToken, (req, res, next)=>{
     const id = req.params.id;
     var query = "delete from bill where id=?";
     connection.query(query,[id], (err, result)=>{
        if(!err){
            if(result.affectedRows == 0){
                return res.status(404).json({message:"bill id don't fount"})
            }
            return res.status(200).json({message:"bill delete successsfully."})
        }else{
            return res.status(500).json(err)
        }
     })
})

module.exports = router
