import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import ApplicationError from "../../errorHandler/applicationError.js";

// Creating model from Schema
const userModel = mongoose.model('User', userSchema);

export default class UserRepository{
  async reset(userID, hashPassword){
    try{
      let user = await userModel.findById(userID);
      if(user){
        user.password = hashPassword;
        user.save();
      }else{
        throw new Error("No such user found", 500);
      }
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong in SignUp", 500);
    }
  }

  async signup(user){
    try{
      // creating instance of model
      const newUser = new userModel(user);
      await newUser.save();
      return newUser;
    }catch(err){
      console.log(err);
      if(err instanceof mongoose.Error.ValidationError){
        throw err;
      }else{
        throw new ApplicationError("Something went wrong in SignUp", 500);
      }
    }
  }

  async signin(email, password){
    try{
      return await userModel.findOne({email, password});
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong in SignUp", 500);
    }
  }

  async findByEmail(email){
    try{
      return await userModel.findOne({email});
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong in finding email", 500);
    }
  }
}