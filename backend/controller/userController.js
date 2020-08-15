const User = require('../models/userModel');
const Inbox = require('../models/inboxModel');
const multer = require('multer')

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null,'./public/')
    },
    filename : function (req, file, cb) {
        cb(null,new Date().toISOString().replace(/:/g,'')+file.originalname.substring(file.originalname.lastIndexOf('.')));
    }
})
const upload = multer({ storage : storage })

exports.getUserData = (req, res, next) => {
    User.findOne({ userId : req.userId })
       .then(user => {
            res.status(200).json({
                user : user
            })
       })
      .catch(err => {
            res.json({
                error : err
            })
      })
}

exports.getUserInfo = (req, res, next) => {
        User.findOne({ userId : req.body.userId }).select('userId name profilePicURL')
        .then(user => {
                res.status(200).json({
                    user : user
                })
            })
        .catch(err => {
                res.json({
                    error : err
                })
        })
}

exports.findFriends = (req, res, next) => {
    User.findOneAndUpdate({ userId : req.userId }, { location :  {
        type : "Point",
        coordinates : [Number(req.body.lng),Number(req.body.lat)]
    }})
    .then(user => {
        User.find({
            $and : [
                {
                    location : {
                        $near : {
                            $maxDistance : user.distance * 1000,
                            $geometry : {
                                type : "Point",
                                coordinates : [req.body.lng,req.body.lat]
                            }
                        }
                    }
                },
                { userId : { $nin : user.userId } }
            ]
            
        })
        .then(nearFriends => {
            res.status(200).json({
                friends : nearFriends
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
}

exports.createInbox = (req, res, next) => {
    const createInbox = new Inbox({ userId : req.body.userId });
    createInbox.save()
      .then(inbox => {
          res.status(200).json({
              inbox
          })
      })
      .catch(err => {
            res.status(200).json({
                err
            })
      })
}

exports.loadInbox = (req, res, next) => {
       Inbox.findOne({ userId : req.userId }).populate('to.r_id')
         .then(inbox => {
             const { to } = inbox;
             const sortedInbox = to; 
             res.status(200).json({
                 sortedInbox
             })
         }) 
         .catch(err => {
             console.log(err);
             res.status(500).json({
                 err
             })
         })
}

exports.setReadStatus = (req, res, next) => {
     const r_id = req.body.r_id;
     const userId = req.userId;
     Inbox.findOneAndUpdate({ userId : userId, 'to.r_id' : r_id },
            {$set: {"to.$.read": true}}
     )
     .then(updated => {
         res.status(200).json({
             updated
         })
     })
     .catch(err => {
         console.log(err);
         res.status(200).json({
             err
         })
     })
}

exports.updateSetting = (req, res, next) => {
    User.findOneAndUpdate({ userId : req.userId },
        {$set : {name : req.body.name, distance : req.body.distance} })
        .then(_ => {
            res.status(201).json({
                status : true
            })
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        })
}

exports.changeProfilePic = (req, res, next) => {
    upload.single('img') (req, res,() => {
        const hostName='http://'+req.get('host');
        const url = hostName+'/'+req.file.path.replace(/\\/g,'/');;
        User.findOneAndUpdate({ userId : req.userId },
            { $set : { profilePicURL : url } })
            .then(_ => {
                res.status(200).json({
                    url : url
                })
            })
            .catch(err => {
                res.status(500).json({
                    err
                })
            })
    })
}

exports.getReadStatus = (req, res, next) => {
    User.findOneAndUpdate({ userId : req.userId },
        { $set : { unreadStatus : false } })
        .then(_ => {
            res.status(200).json({
                status : true
            })
        })
        .catch(err => {
            res.status(500).json({
                err
            })
        })
}

exports.compareLocation = (req, res, next) => {
    User.find({ $or: [{ userId: req.userId }, { _id : req.body.friendId }]}).select('location')
       .then(loc => {
           res.status(201).json({
               loc
           })
       })
       .catch(err => {
        res.status(500).json({
            err
        })
    })
}