import express from "express"
import cors from "cors"
import http from "http"
import "dotenv/config"
import { connectDb } from "./lib/db.js"
import userRouter from "./routes/userRoutes.js"
import { Server } from "socket.io"
import { useId } from "react"

const app = express()
const server = http.createServer(app)

// Initialize Scoket.io server
export const io = new Server(server,{
    cors:{origin:"*"}
})

// Store Online Users with format -> userId:SocketId
export const userScoketMap = {}

// socketio connection handler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User connected with id "+userId)
    // basically add the user to the map 
    if(userId) userScoketMap[userId] =socket.id
    
    io.emit("getOnlineUsers", Object.keys(userScoketMap))

    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId)
        delete userScoketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userScoketMap))
    })
})

// Middle-where 
app.use(express.json({limit:"4mb"}))
app.use(cors())

//Router setup
app.use("/api/status", (req, res)=> res.send("Server is Serving (live)"));
app.use("/api/auth", userRouter)

//connecting to mongodb
await connectDb()

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=> console.log("Server is running on PORT: "+PORT))

