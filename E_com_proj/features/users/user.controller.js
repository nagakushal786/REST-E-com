import ApplicationError from "../../errorHandler/applicationError.js";
import UserModel from "./user.model.js";
import UserRepository from "./user.repository.mongoose.js";
import jwt from "jsonwebtoken";
// import UserRepo from "./user.repository.mongodb.js";
import bcrypt from "bcrypt";

export default class UserController{
  constructor(){
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res){
    const {newPassword} = req.body;
    const hashPassword = bcrypt.hash(newPassword, 12);
    const userID = req.userID;
    try{
      await this.userRepository.reset(userID, hashPassword);
      return res.status(200).send("Password updated");
    }catch(err){
      throw new ApplicationError("Password has not been updated", 500);
    }
  }

  async signUp(req, res){
    try{
      const {name, email, password, type} = req.body;
      const hashPassword = await bcrypt.hash(password, 12);
      const regUser = new UserModel(name, email, hashPassword, type);
      await this.userRepository.signup(regUser);
      res.status(201).send(regUser);
    }catch(err){
      throw new ApplicationError("Signup failed due to unknown user", 500);
    }
  }

  async signIn(req, res, next){
    try{
      const {email, password} = req.body;
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      console.log(user);
      if(!user){
        return res.status(400).send("Incorrect credentials");
      }else{
        // Compare password with hashed password
        const result = bcrypt.compare(password, user.password);
        if(result){
          const token = jwt.sign(
            {
              userID:user._id,
              email:user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn:'1d',
            }
          );
          // Send the token
          return res.status(200).send(token);
        }else{
          return res.status(400).send("Incorrect credentials");
        }
      }
    }catch(err){
      console.log(err);
      return res.status(401).send("Something went wrong");
    }
  }

  getUsers(req, res){
    const users = UserModel.getAll();
    res.status(200).send(users);
  }
}