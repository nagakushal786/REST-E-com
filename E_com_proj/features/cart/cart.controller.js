import { ObjectId } from "mongodb";
import CartModel from "./cart.model.js";
import CartRepository from "./cart.repository.js";

export default class CartController{
  constructor(){
    this.cartRepository = new CartRepository();
  }

  async addCart(req, res){
    try{
      const {productID, quantity} = req.body;
      const userID = req.userID;
      await this.cartRepository.add(userID, productID, quantity);
      res.status(201).send("Cart is updated");
    }catch(err){
      console.log(err);
      return res.status(401).send("Something went wrong");
    }
  }

  async getItems(req, res){
    try{
      const items = await this.cartRepository.getAll();
      res.status(200).send(items);
    }catch(err){
      console.log(err);
      return res.status(401).send("Something went wrong");
    }
  }

  async getUserItem(req, res){
    try{
      const userID = req.userID;
      const item = await this.cartRepository.get(userID);
      return res.status(200).send(item);
    }catch(err){
      console.log(err);
      return res.status(401).send("Something went wrong");
    }
  }

  async deleteItem(req, res){
    try{
      const userID = req.userID;
      const cartItemID = req.params.id;
      const isDeleted = await this.cartRepository.delete(cartItemID, userID);
      if(!isDeleted){
        return res.status(404).send("Item not found");
      } else {
        return res.status(200).send("Cart item is removed");
      }
    }catch(err){
      console.log(err);
      return res.status(401).send("Something went wrong");
    }
  }
}