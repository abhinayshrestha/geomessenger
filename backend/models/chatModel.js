const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
     sender : {
         type : String,
         ref : 'User'
     },
     receiver : {
        type : String
    },
     message : {
         type : String
     },
     created_at: {type: Date, default: Date.now},
})

module.exports = mongoose.model('Chat',chatSchema);
