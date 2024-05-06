import {getDB} from "../../config/mongodb.js";
import ApplicationError from "../../errorHandler/applicationError.js";

export default class UserModel{
  constructor(name, email, password, type, id){
    this.name=name;
    this.email=email;
    this.password=password;
    this.type=type;
    this._id=id;
  }

  // static async SignUp(name, email, password, type){
  //   try{
  //     const db = getDB();
  //     const collection = db.collection('users'); 
  //     const newUser = new UserModel(name, email, password, type);
  //     await collection.insertOne(newUser);  
  //     return newUser;
  //   }catch(err){
  //     throw new ApplicationError("Something went wrong", 500);
  //   }
  // }

  // static SignIn(email, password){
  //   const reqUser = users.find(u => u.email == email && u.password == password);
  //   return reqUser;
  // }

  static getAll(){
    return users;
  }
}

let users=[
  {
    "id":1,
    "name":"Seller user",
    "email":"seller@ecom.com",
    "password":"Seller123",
    "type":"Seller"
  },
  {
    "id":2,
    "name":"Customer user",
    "email":"customer@ecom.com",
    "password":"Customer123",
    "type":"Customer"
  },
];