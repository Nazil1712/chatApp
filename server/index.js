const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")


const PORT = 3001

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods:["GET","POST","PUT","DELETE","PATCH"] 
    }
})


io.on("connection",(socket)=>{
    console.log(`User Connected ${socket.id}`)

    socket.on("join_room",(data)=>{
        socket.join(data.room)
        console.log(data)
    })

    socket.on("send_message",(data)=>{
        console.log("MESSAGE",data)
        socket.to(data.room).emit("receive_message",data)
    })
    socket.on("disconnect",()=>{
        console.log("User Disconnected")
    })
})



server.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`)
})