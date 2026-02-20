import dotenv from 'dotenv/config'
//dotenv.config() // Load environment variables from .env file
import connectDB from "./db/index.js";
import {app} from "./app.js" 


//DB connection 
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("applicatin not able to talk to mongoose", error)
        throw error
    })
    console.log("Database connected successfully")
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port:- http://localhost:${process.env.PORT || 8000}`)
    })
})
.catch((err)=>{
    console.log("database connection failed")
})



