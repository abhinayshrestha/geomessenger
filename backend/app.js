const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRouter');
const cors = require('cors');
const bodyParser = require('body-parser');
const { onlineUsers } = require('./util/onlineUsers');
const chatRoutes = require('./routes/chatRoutes');
const User = require('./models/userModel');

app.use(cors());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json())
app.use('/public', express.static('public'));

app.use('/', authRoutes);
app.use('/app',userRoutes);
app.use('/chat',chatRoutes);

mongoose.connect('mongodb+srv://abhinay:password@cluster0-aabr9.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => {
        const port = process.env.PORT || 8000;
        const server = app.listen(port);
        global.io = require('./util/socketConnection').init(server);
        io.on('connection', socket => {
            socket.on('user_online', data => {
                socket.userID = data;
                onlineUsers[socket.userID] = socket;
                User.findOneAndUpdate({ userId : data },
                    { $set : { isOnline : true } })
                    .then(_ => {
                        socket.broadcast.emit('online-status', { userId : data });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            socket.on('logout',() => {
                  socket.disconnect();  
            })
            socket.on('disconnect', () => {
                if(!socket.userID) return;
                delete onlineUsers[socket.userID];
                User.findOneAndUpdate({ userId : socket.userID },
                    { $set : { isOnline : false } })
                    .then(_ => {
                        socket.broadcast.emit('offline-status', { userId : socket.userID });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
        })
   })
   .catch(err => {
       console.log(err);
   })
