const util = require('util');
const logger = require('../../logger');

const jsonwebtoken = require('jsonwebtoken');
const jwt = {
    sign: util.promisify(jsonwebtoken.sign),
    verify: util.promisify(jsonwebtoken.verify),
}

const config = require('../../config');

async function requireAuthC(req, res, next){
    const authorizationHeader = req.get('Authorization') || '';
    const match = authorizationHeader.match(/Bearer\s+(\S)+/i);
    if(match){
        try{
            const payload = await jwt.verify(
                match[1], 
                config.publicKey, { 
                    issuer: "taz.harding.edu",
                    aud: "asq-test",
                    roles: ["admin"],
                 }
            );
            if (!payload.roles.includes('admin')) {
                res.status(403);
                res.json({
                    message: "Unauthorized"
                });
            }
            else {
                res.locals.login = payload;
                next();
            }
        }
        catch(err) {
            logger.info(err)
            res.status(401);
            res.set('WWW-Authenticate', 'Bearer');
            res.json({
                message: "Invalid authorization token"
            });
        }
    }
    else{
        res.status(401);
        res.set('WWW-Authenticate', 'Bearer'); 
        res.json({
            message: "Bearer authentication required"
        });
    } 

    next();
}


module.exports = { requireAuthC };