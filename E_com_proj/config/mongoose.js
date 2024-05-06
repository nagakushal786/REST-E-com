import mongoose from "mongoose";
import '../../env.js'
import { categorySchema } from "../features/products/category.schema.js";

const url = process.env.DB_URL;
export const connectMongoose = async ()=>{
  try{
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected using mongoose");
    addCategories();
  }catch(err){
    console.log("Error connecting to Mongoose: ", err);
  }
}

async function addCategories(){
  const categoryModel = mongoose.model('Category', categorySchema);
  const categories = await categoryModel.find();
  if(!categories || categories.length===0){
    await categoryModel.insertMany([{name:'Books'}, {name:'Clothing'}, {name:'Electronics'}]);
  }
  console.log('Categories are added');
}