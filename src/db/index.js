import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"


const connectDB = async ()=>{
    try{
        console.log(process.env.MONGODB_URI)
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
       console.log(`\n Mongo db connected ${connectionInstance.connection.host}`) // learn  about this
    }catch(error){
        console.log("Monngo Db connection error ",error)
        process.exit(1) // learn about this process
    }
}

export default connectDB