import express from "express"
import cors from "cors"
import http from "http"
import "dotenv/config"
import { connectDb } from "./lib/db.js"
import userRouter from "./routes/userRoutes.js"


const app = express()
const server = http.createServer(app)

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

