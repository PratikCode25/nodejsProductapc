const mongoose = require('mongoose');


const csvSchema = mongoose.Schema({
    name: {
        type: String,
      
    },
    email: {
        type: String,
       
    },
    phone: {
        type: Number,

    },
    city: {
        type: String,

    },

});

module.exports = mongoose.model('csvuser', csvSchema)