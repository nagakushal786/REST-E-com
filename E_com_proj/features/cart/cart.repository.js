import { ObjectId } from 'mongodb';
import {getDB} from '../../config/mongodb.js';
import ApplicationError from '../../errorHandler/applicationError.js';

export default class CartRepository{
  constructor(){
    this.collection = 'cart';
  }

  async add(userID, productID, quantity){ 
    try{
      const db = getDB();
      const collection = db.collection(this.collection);
      const id = this.getNextCounter(db);
      // Find the document
      // Either insert or update
      await collection.updateOne(
        {userID: new ObjectId(userID), productID: new ObjectId(productID), quantity},
        {
          $setOnInsert:{_id:id},
          $inc:{
          quantity: quantity
        }},
        {upsert: true});
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async get(userID){
    try{
      const db = getDB();
      const collection = db.collection(this.collection);
      return await db.collection.find({userID: new ObjectId(userID)}).toArray();
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getAll(){
    try{
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find().toArray();
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async delete(cartItemID, userID){
    try{
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.deleteOne({_id: new ObjectId(cartItemID), userID: new ObjectId(userID)});
      return result.deleteCount > 0;
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getNextCounter(db){
    const resultDocument = await db.collection('counters').findOneAndUpdate(
      {_id:'cartItemID'},
      {$inc:{value:1}},
      {returnDocument:'after'}
    );
    console.log(resultDocument);
    return resultDocument.value.value;
  }
}