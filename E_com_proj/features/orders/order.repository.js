import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import ApplicationError from "../../errorHandler/applicationError.js";
import OrderModel from "./order.model.js";
import { getClient } from "../../config/mongodb.js";

export default class OrderRepository{
  constructor(){
    this.collection = "orders";
  }

  async placeOrder(userID){
    const client = getClient();
    const session = client.startSession();
    try{
      const db = getDB();
      const collection = db.collection(this.collection);
      session.startTransaction();
      // 1. Get cartitems and calculate the total amount
      const items = await this.getTotAmount(userID, session);
      const amount = items.reduce((acc, item)=>acc+item.totAmount, 0)
      console.log(`The total amount is ${amount}`);
      // 2. Create the order record
      const newOrder = new OrderModel(new ObjectId(userID), amount, new Date());
      await collection.insertOne(newOrder, {session});
      // 3. Update the stock
      for(let item of items){
        await db.collection("products").updateOne(
          {_id:item.productID},
          {$inc:{stock:-item.quantity}},
          {session}
        )
      }
      // throw new Error("Something is wrong in placeOrder");
      // 4. Clear the cart
      await db.collection("cart").deleteMany({
        userID: new ObjectId(userID)
      }, {session}); 
      session.commitTransaction();
      session.endSession();
      return;
    }catch(err){
      await session.abortTransaction();
      session.endSession();
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getTotAmount(userID, session){
    const db = getDB();
    const items = await db.collection("cart").aggregate([
      // 1. Get cart items for the user
      {
        $match:{
          userID: new ObjectId(userID)
        }
      },
      // 2. Get the products from products collection
      {
        $lookup:{
          from:"products",
          localField:"productID",
          foreignField:"_id",
          as:"productInfo"
        }
      },
      // 3. Unwind the productInfo
      {
        $unwind:"$productInfo"
      },
      // 4. Calculate total amount for each cart item
      {
        $addFields:{
          "totAmount":{
            $multiply:[
              "$productInfo.price",
              "$quantity"
            ]
          }
        }
      }
    ], {session}).toArray();
    return items;
  }
}