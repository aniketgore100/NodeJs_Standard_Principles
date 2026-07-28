import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
        unique : true,
        minlength : 21,
    },
    password : {
        type : String,
        minlength : 8
    },
    refreshToken : {
        type : String,
        default : null
    }
}, 
{timestamps : true}
)

const User = mongoose.model("User", userSchema);
export default User;
