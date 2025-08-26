import express from "express"
import cors from "cors"
import http from "http"
import "dotenv/config"
import { connectDb } from "./lib/db.js"


const app = express()
const server = http.createServer(app)

// Middle-where 
app.use(express.json({limit:"4mb"}))
app.use(cors())

app.use("/api/status", (req, res)=> res.send("Server is Serving (live)"));

//connecting to mongodb
await connectDb()

const PORT = process.env.PORT || 5000;

server.listen(PORT, ()=> console.log("Server is running on PORT: "+PORT))

const b = "mongodb+srv://abhi:<db_password>@cluster0.tp1nqsz.mongodb.net"