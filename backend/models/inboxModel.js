const mongoose = require('mongoose');

const inboxSchema = new mongoose.Schema({
    userId : {
        type : String
    },
    to : [{ 
        lastMsg : {
            type : String
        },
        r_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        updated_at : {type: Date, default: Date.now},
        read : { type : Boolean, default : false }
     }]
})

module.exports = mongoose.model('Inbox',inboxSchema);
