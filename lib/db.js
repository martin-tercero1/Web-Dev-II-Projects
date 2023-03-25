const mongoose = require('mongoose');
const config = require('./config');

function connect(){
    mongoose.set('strictQuery',true);
    return mongoose.connect(
        `mongodb://${config.hostname}/${config.dbname}`
    );
}

module.exports = { connect };