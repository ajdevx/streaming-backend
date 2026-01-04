import dotenv from 'dotenv'
import mongoose from "mongoose"
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
// require('dotenv').config({path:`./env`});
dotenv.config()

//DB connection 
connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("applicatin not able to talk to mongoose", error)
        throw error
    })
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at port${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("database connection failed")
})



/*
import express from "express";
const app = express(); 

;(async function connectDB(){
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
       app.on("error",(error)=>{
        console.log("applicatin not able to talk to mongoose", error)
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log(`app is listning on${process.env.PORT}`)
       })

    }catch(err){
        console.log("There error in connection :",err);
    }
})();
*/


