import pkg, { ObjectId } from "mongodb";
const {findById} = pkg;
import {getDB} from "../../config/mongodb.js";
import ApplicationError from "../../errorHandler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./reviews.schema.js";
import { categorySchema } from "./category.schema.js";

const productModel = mongoose.model('Product', productSchema);
const reviewModel = mongoose.model('Review', reviewSchema);
const categoryModel = mongoose.model('Category', categorySchema);

class ProductRepo{
  async addProduct(productData){
    try{
      console.log(productData);
      if(!productData.category){
        throw new Error("Category is required");
      }
      // 1. Add new product
      // productData.categories = productData.category.split(',').map(e=>e.trim());
      const newProduct = new productModel(productData);
      const savedProduct = await newProduct.save();
      // 2. Update the categories
      await categoryModel.updateMany(
        {
          _id: {$in: productData.categories}
        },
        {
          $push: {products: new ObjectId(savedProduct._id)}
        }
      );
    }catch(err){
      console.log(err);
      throw new ApplicationError("Product not added", 500);
    }
  }

  async getAll(){
    try{
      const db = getDB();
      const collection = db.collection('products');
      const products = await collection.find().toArray();
      return products;
    }catch(err){
      console.log(err);
      throw new ApplicationError("Products not retrieved", 500);
    }
  }

  async get(id){
    try{
      const db = getDB();
      const collection = db.collection('products');
      return await collection.findOne({_id: new ObjectId(id)});
    }catch(err){
      console.log(err);
      throw new ApplicationError(`Product with id ${id} not retrieved`, 500);
    }
  }

  // Product having min price, max price and category specified
  // async filter(minPrice, maxPrice, category){
  //   try{
  //     const db = getDB();
  //     const collection = db.collection('products');
  //     let filterExpression = {};
  //     if(minPrice){
  //       filterExpression.price = {$gte: parseFloat(minPrice)};
  //     }
  //     if(maxPrice){
  //       filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)};
  //     }
  //     if(category){
  //       filterExpression.category = category;
  //     }
  //     return await collection.find(filterExpression).toArray();
  //   }catch(err){
  //     console.log(err);
  //     throw new ApplicationError("Products not filtered", 500);
  //   }
  // }
  
  // Product should have min price and category specified - MongoDB operators
  // async filter(minPrice, category){
  //   try{
  //     const db = getDB();
  //     const collection = db.collection('products');
  //     let filterExpression = {};
  //     if(minPrice){
  //       filterExpression.price = {$gte: parseFloat(minPrice)};
  //     }
  //     if(category){
  //       filterExpression = {$and:[{category:category}, {filterExpression}]}
  //     }
  //     return await collection.find(filterExpression).toArray();
  //   }catch(err){
  //     console.log(err);
  //     throw new ApplicationError("Products not filtered", 500); 
  //   }
  // }

  // For $in operator - in url provide categories as array and even convert the string to array bcz $in takes an array
  // async filter(minPrice, categories){
  //   try{
  //     const db = getDB();
  //     const collection = db.collection('products');
  //     let filterExpression = {};
  //     if(minPrice){
  //       filterExpression.price = {$gte: parseFloat(minPrice)};
  //     }
  //     // ['Cat1', 'Cat2']
  //     categories = JSON.parse(categories.replace(/'/g, ""));
  //     console.log(categories);
  //     if(categories){
  //       filterExpression = {$and:[{category:{$in:categories}}, {filterExpression}]}
  //     }
  //     return await collection.find(filterExpression).toArray();
  //   }catch(err){
  //     console.log(err);
  //     throw new ApplicationError("Products not filtered", 500); 
  //   }
  // }

  // Using projection operators
  async filter(minPrice, maxPrice, category){
    try{
      const db = getDB();
      const collection = db.collection('products');
      let filterExpression = {};
      if(minPrice){
        filterExpression.price = {$gte: parseFloat(minPrice)};
      }
      if(maxPrice){
        filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)};
      }
      if(category){
        filterExpression.category = category;
      }
      // Return the filtered documents containing only id(default), name, price
      return await collection.find(filterExpression).project({name:1, price:1}).toArray();
      // To remove the id
      // return await collection.find(filterExpression).project({_id:0, name:1, price:1}).toArray();
      // To get only 1st rating of all documents - using $slice operator
      // return await collection.find(filterExpression).project({_id:0, name:1, price:1, ratings:{$slice:1}}).toArray();
    }catch(err){
      console.log(err);
      throw new ApplicationError("Products not filtered", 500);
    }
  }

  // async rate(userID, productID, rating){
  //   // When 2 requests parallelly process to perform same operation on shared data
  //   try{
  //     const db = getDB();
  //     const collection = db.collection('products');
  //     // Find the product
  //     const product = await collection.findOne({_id: new ObjectId(productID)});
  //     // Find the rating
  //     const userRating = product?.ratings?.find(r=> r.userID == userID);
  //     if(userRating){
  //       // Update the rating
  //       await collection.updateOne({
  //         _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)
  //       },{
  //         $set: {"ratings.$.rating":rating}
  //       });
  //     }else{
  //       await collection.updateOne({
  //         _id: new ObjectId(productID)},{
  //           $push:{ratings:{userID: new ObjectId(userID), rating}}
  //         });
  //     }
  //   }catch(err){
  //     console.log(err);
  //     throw new ApplicationError("Product not rated", 500);
  //   }
  // }

  // Using MongoDB
  // async rate(userID, productID, rating){
  //   // When 2 requests parallelly process to perform same operation on shared data
  //   try{
  //     const db = getDB();
  //     const collection = db.collection('products');
  //     // Removes existing entry
  //     await collection.updateOne({
  //       _id: new ObjectId(productID)
  //     },{
  //       $pull: {ratings:{userID: new ObjectId(userID)}}
  //     });
  //     // Add new entry
  //     await collection.updateOne({
  //       _id: new ObjectId(productID)
  //     },{
  //       $push:{ratings:{userID: new ObjectId(userID), rating}}
  //     });
  //   }catch(err){
  //     console.log(err);
  //     throw new ApplicationError("Product not rated", 500);
  //   }
  // }

  async rate(userID, productID, rating){
    try{
      // 1. Check whether product is present or not
      const productToUpdate = await productModel.findById(productID);
      if(!productToUpdate){
        throw new Error("Product not found");
      }
      // 2. Get the existing review
      const userReview = await reviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID)
      });
      if(userReview){
        userReview.rating=rating;
        await userReview.save();
      }else{
        const newUser = new reviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating
        });
        await newUser.save();
      }
    }catch(err){
      console.log(err);
      throw new ApplicationError("Product not rated", 500);
    }
  }

  // Aggregate pipelining - See the APIlist.txt
  // {_id:'Cat1', avgPrice:5000} - There are no such fields but we have to create
  // them temporarily in the result but not in the databse
  // { $group: {
  //   _id:"$product",
  //   totalRevenue:
  //   { $sum: {$multiply:["$quantity","$price"] } } }
  // }
  async avgProPricePerCat(){
    try{
      const db = getDB();
      const collection = db.collection('products');
      return await collection.aggregate([
        // Stage 1: Get average price per category
        {
          $group:{_id:"$category", avgPrice:{$avg:"$price"}}
        }
      ]).toArray();
    }catch(err){
      console.log(err);
      throw new ApplicationError("Product not rated", 500);
    }
  }
}

export default ProductRepo;