import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";

const likeModel = mongoose.model('Like', likeSchema);

export default class LikeRepository{

  async get(id, type){
    return await likeModel.find({
      likeable: new ObjectId(id),
      types: type
    }).populate('user').populate({path: 'likeable', model: type});
  }

  async likeProduct(userID, productID){
    try{
      const newLike = new likeModel({
        user: new ObjectId(userID),
        likeable: new ObjectId(productID),
        types: 'Product'
      });
      await newLike.save();
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async likeCategory(userID, categoryID){
    try{
      const newLike = new likeModel({
        user: new ObjectId(userID),
        likeable: new ObjectId(categoryID),
        types: 'Category'
      });
      await newLike.save();
    }catch(err){
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}