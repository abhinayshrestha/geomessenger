const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    name : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
    profilePicURL : {
        type : String,
        required : true
    },
    location : {
        type : {
            type : String,
            default : 'Point'
        },
        coordinates : [Number,Number]
    },
    distance : {
        type : Number,
        default : 30
    },
    unreadStatus : {
        type : Boolean,
        default : false
    },
    isOnline : {
        type : Boolean,
        default : true
    }
})

userModel.index({ location: '2dsphere' });
module.exports = mongoose.model('User', userModel);