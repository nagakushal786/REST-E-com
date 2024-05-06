import express from "express";
import CartController from "./cart.controller.js";

const cartRouter = express.Router();

const cartController = new CartController();

cartRouter.post('/', (req, res, next)=>{
  cartController.addCart(req, res, next);
});
cartRouter.get('/', (req, res, next)=>{
  cartController.getItems(req, res, next);
});
cartRouter.get('/userID', (req, res, next)=>{
  cartController.getUserItem(req, res, next);
});
cartRouter.delete('/:id', (req, res, next)=>{
  cartController.deleteItem(req, res, next);
});

export default cartRouter;