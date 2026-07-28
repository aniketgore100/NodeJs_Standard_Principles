import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Db connceted: ")
    }catch(error){
        console.error("mongo connection error ::: ", error);
        process.exit(1)
    }
}

export default connectDb;