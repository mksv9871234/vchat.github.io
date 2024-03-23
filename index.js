const http=require('http')
const express =require('express')
const cors = require('cors')
const socketIo = require('socket.io')

const app=express();
const port= process.env.PORT || 4500;

const users=[{}];

app.use(cors());
app.get('/',(req,resp)=>{
    resp.send("hello its working")
})
const server=http.createServer(app);

const io=socketIo(server);

io.on("connection",(socket)=>{
    console.log("new connection");
    socket.on('joined',({user})=>{
        users[socket.id]=user
            console.log(user)
    socket.broadcast.emit('userJoined',{user:'Admin',message:`${users[socket.id]} has Joined`});
    socket.emit('welcome',{user:"admin",message:`welcome to the vchat ${users[socket.id]}`})
    })
    
// last time here id incude video on 1:10:31 last time watch from this time
    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id})
    })

    socket.on('disconnect',()=>{
        socket.broadcast.emit('leave',{user:'Admin',message:`${users[socket.id]} has left`})
        console.log("user left")
        
    })

})

server.listen(port,()=>{
    console.log(`server is working on http://localhost:4500 ${port}`)
})


