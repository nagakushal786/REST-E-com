import {getDB} from "../../config/mongodb.js";
import ApplicationError from "../../errorHandler/applicationError.js";

class UserRepo{
  async SignUp(newUser){
    try{
      // Get the database
      const db = getDB();
      // Get the collection
      const collection = db.collection('users');
      // Insert the document
      await collection.insertOne(newUser);  
      return newUser;
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong in SignUp", 500);
    }
  }

  async SignIn(email, password){
    try{
      // Get the database
      const db = getDB();
      // Get the collection
      const collection = db.collection('users');
      // Find the document
      return await collection.findOne({email, password});
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong in SignIn", 500);
    }
  }

  async findByEmail(email){
    try{
      // Get the database
      const db = getDB();
      // Get the collection
      const collection = db.collection('users');
      // Find the document
      return await collection.findOne({email});
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong in finding email", 500);
    }
  }
}

export default UserRepo;