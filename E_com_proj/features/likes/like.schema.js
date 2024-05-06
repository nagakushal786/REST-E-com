import mongoose from "mongoose";

// Multiple references
export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'types'
  },
  types: {
    type: String,
    enum: ['Product', 'Category']
  }
}).pre('save', (next)=>{ // Middlewares in mongoose
  console.log("New like coming in");
  next();
}).post('save', (doc)=>{
  console.log('Like is saved');
  console.log(doc);
}).pre('find', (next)=>{
  console.log("Likes are being retrieved");
  next();
}).post('find', (doc)=>{
  console.log("Find is completed");
  console.log(doc);
});