const Chat = require('../models/chatModel');
const { onlineUsers } = require('../util/onlineUsers');
const Inbox = require('../models/inboxModel');
const User = require('../models/userModel');

exports.sendMessage = (req, res, next) => {
     if(onlineUsers[req.params.id]){
        onlineUsers[req.params.id].emit('private_msg', { sender : req.userId, _id : req.body.s_id , receiver : req.params.id, message : req.body.message, updated_at : new Date().toISOString() });   
     } 
    const from = req.userId;
     const to = req.params.id;
     const chatModel = new Chat({
         sender : from,
         receiver : to,
         message : req.body.message
     });
     chatModel.save()
     .then(chat => {
            Inbox.findOneAndUpdate({userId : from, 'to.r_id' : { $ne : req.body.r_id}},
            {$push: {to : { r_id : req.body.r_id, lastMsg : req.body.message, read : true }}})
            .then( data=> {
                Inbox.findOneAndUpdate({userId : to, 'to.r_id' : { $ne : req.body.s_id}},
                {$push: {to : { r_id : req.body.s_id, lastMsg : req.body.message, read : false }}})
                .then( updated => {
                    if(updated === null){
                        Inbox.update(
                            {userId : from , 'to.r_id' : req.body.r_id },
                            {$set: {"to.$.lastMsg": req.body.message ,"to.$.updated_at": new Date().toISOString(),"to.$.read": true}},
                            {"multi": true}
                        )
                        .then(data => {
                            Inbox.update(
                                {userId : to , 'to.r_id' : req.body.s_id },
                                {$set: {"to.$.lastMsg": req.body.message ,"to.$.updated_at": new Date().toISOString(),"to.$.read": false}},
                                {"multi": true}
                            )
                            .then(data => {
                                res.status(200).json({
                                    updateInbox : true
                                })
                            })
                            .catch(err => {
                                res.status(200).json({
                                    err
                                })
                            });
                        })
                        .catch(err => {
                            res.status(200).json({
                                err
                            })
                        });
                    }
                    else{
                        res.status(200).json({
                            updateInbox : false
                        })
                    }
                
                })
                .catch(err => {
                    res.status(200).json({
                        err
                    })
                 })
               
            })
            .catch(err => {
                    res.status(200).json({
                    err
                })
             })
     })
     .catch(err => {
        res.status(200).json({
            err
        })
     })
   User.findOneAndUpdate({ userId : req.params.id },
                 { $set : { unreadStatus : true } })
        .then(_ => {})
        .catch(err => {})                
}

exports.loadMessage = (req, res, next) => {
    Chat.find({ 
        $or : [{ sender : req.userId, receiver : req.body.receiver }, {sender : req.body.receiver, receiver : req.userId }]
     }).sort({ created_at : -1 })
     .then(chat => {
         res.status(200).json({
             chat
         })
     })
     .catch(err => {
         res.status(500).json({
             err
         })
     })
}