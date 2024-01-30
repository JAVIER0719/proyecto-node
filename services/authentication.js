require('dotenv').config();
const jwt = require('jsonwebtoken');

authenticateToken((req, res, next)=>{
    const authHeader = req.header['aauthorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(toke==null)
        return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCES_TOKEN, (err, response)=>{
        if(err)
            return res.sendStatus(403);
        res.locals = response;
        next()
        })
})

module.exports={authenticateToken: authenticateToken}