import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    fullName:{type:String, required:true},
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    createdOn:{type:Date, default:new Date().getTime()},
});
const User = mongoose.model("User", userSchema);
export default User;