const util = require('util');
const logger = require('../../logger');

const jsonwebtoken = require('jsonwebtoken');

const config = require('../../config');

async function requireAuthC(req, res, next){
    const authorizationHeader = req.get('Authorization') || '';
    const match = authorizationHeader.match(/Bearer\s+(\S+)/i);
    if(match){
        try {
            const payload = await jsonwebtoken.verify(match[1], config.publicKey, {
              issuer: "taz.harding.edu",
              audience: "test"
            });
            
            if (!payload.roles.includes("admin")) {
                res.status(403);
                res.json({
                message:
                    "User not authorized to perform this action",
                });
            } else {
                res.locals.login = payload;
                next();
            }
        } catch (error) {
            res.set("WWW-Authenticate", "Bearer");
            res.status(401);
            res.json({
                message: "Authorization is required",
            });
        }
    }
    else{
        res.set("WWW-Authenticate", "Bearer"); 
        res.status(401);
        res.json({
          message: "Authorization is required"
        });
    } 

   // next();
}


module.exports = { requireAuthC };