import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express();

//configure cross origin 
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true //learn
}))

//setting middleware, it allow all json and it will be parsor
app.use(express.json({limit: "16kb"})) // before we have to use body parsor
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(cookieParser())
app.use(express.static("public"))

//importing routes
import userRouter from "./routes/user.route.js"

//using routes
app.use("/api/v1/users",userRouter)
export {app}