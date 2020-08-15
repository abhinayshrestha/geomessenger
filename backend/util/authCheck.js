const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHead = req.get('Authorization');
    if(!authHead){
        console.log('err');
        res.status(401).json({
            message : 'Auth Failed',
            status : false
        })
    }
    else{
        const token = authHead.split(" ")[1];
        let decode;
        try{
           decode = jwt.verify(token,'geomessenger-secret');
           req.userId = decode.userId;
           next();
        }
        catch (err) {
            console.log(err);
            res.status(401).json({
                error : err,
                message : 'Auth Failed',
                status : false
            })
        }
    }
 
  
}