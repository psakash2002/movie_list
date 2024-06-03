import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
//const User= require("./models/usermodel.js")
import jwt from 'jsonwebtoken';
import authenticateToken from "./utilities.js";
import User from './models/usermodel.js';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());    
const PORT=4040;


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to mongoDB");
        app.listen(PORT,()=>{
            console.log(`App is listening to the port ${PORT}`);
        });
        app.get("/", (req,res)=>{
            res.json({data:"hello"});
        });
        app.post("/create-account", async(req, res)=>{
            const {fullName,email, password}=req.body;
            if(!fullName){
                return res
                .status(400)
                .json({error:true,message:"Full name is required"});
            }
            if(!email){
                return res
                .status(400)
                .json({error:true,message:"email is required"});
            }
            if(!password){
                return res
                .status(400)
                .json({error:true,message:"password is required"});
            }
            const isUser = await User.findOne({email:email});
            if(isUser){
                return res.json({
                    error:true,
                    message:'User already exist',
                });
            }
            const user=new User({fullName, email, password});
            await user.save();
            const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET,{
                expiresIn:"3600m"
            });
            return res.json({
                error:false,
                user,
                accessToken,
                mesage:"Registration Successful",
            })
        });
        app.post("/login", async (req,res) => {
            const {email, password} = req.body;
            if(!email){
                return res.status(400).json({message:"Email is required"});
            
            }
            if(!password){
                return res.status(400).json({message:"Password is required"});
            }
            const userInfo = await User.findOne({email:email});
            if(!userInfo){
                return res.status(400).json({message:"User not found"});
            }
            if(userInfo.email == email && userInfo.password ==password){
                const user = {user:userInfo};
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
                    expiresIn:"3600m"
            });
                return res.json({
                    error: false,
                    message: "Login Successful",
                    email,
                    accessToken,
                });
            }else{
                    return res.status(400).json({
                        error:true,
                        message:"Invalid credentials",
                    });
            }
        });
    })