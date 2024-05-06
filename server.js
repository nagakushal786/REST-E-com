// Import required modules
import './env.js';
import express from 'express';
import jwtAuth from './E_com_proj/middlewares/jwt.middleware.js';
import swagger, { serve } from "swagger-ui-express";
import cors from "cors";

import ProductRouter from "./E_com_proj/features/products/product.router.js";
// import bodyParser from "body-parser";
import UserRouter from './E_com_proj/features/users/user.router.js';
// import basicAuth from './E_com_proj/middlewares/basicAuth.middleware.js';
import OrderRouter from './E_com_proj/features/orders/order.router.js';
import cartRouter from './E_com_proj/features/cart/cart.router.js';
import LikeRouter from './E_com_proj/features/likes/like.router.js';
import apiDocs from "./swagger.json" assert {type:"json"};
import openApiDocs from "./swagger3.json" assert {type:"json"};
// import loggerMiddleware from './E_com_proj/middlewares/logger.middleware.js';
import winstonloggerMiddleware from './E_com_proj/middlewares/winston.middleware.js'; 
import ApplicationError from './E_com_proj/errorHandler/applicationError.js';
import {mongodbConnect} from './E_com_proj/config/mongodb.js';
import { connectMongoose } from './E_com_proj/config/mongoose.js';
import mongoose from 'mongoose';

// Create a server
const server = express();

// CORS ( Cross Origin Resource Sharing ) policy - prevent request from cross origin application like server on one origin and client on another origin
// Use - To limit API access to specific clients and prevent unauthorized requests
// CORS policy configuration
// * - Access to all web clients and url - to specific users
// preflight - verification request sent by client before making an actual request

// Using CORS headers
// server.use((req, res, next)=>{
//   res.header('Access-Control-Allow-Origin', 'http://localhost:5501');
//   res.header('Access-Control-Allow-Headers', '*');
//   res.header('Access-Control-Allow-Methods', '*');
//   if(req.method == "OPTIONS"){
//     return res.sendStatus(200);
//   }
//   next();
// });

// Using cors library
const corsOptions = {
  origin: "http://localhost:5501"
}
server.use(cors(corsOptions));

// Using body parser to decode the data
server.use(express.json());

// Bearer <token>
// If any request related to products, redirect to product router
server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));
server.use('/api-open-docs', swagger.serve, swagger.setup(openApiDocs));

server.use(winstonloggerMiddleware);

server.use('/api/products', jwtAuth, ProductRouter);
server.use('/api/users', UserRouter);
server.use('/api/cart', jwtAuth, cartRouter);
server.use('/api/orders', jwtAuth, OrderRouter);
server.use('/api/likes', jwtAuth, LikeRouter);

// Create a default request handler
server.get('/',(req, res)=>{
  res.send("Welcome to E-commerce APIs");
});

// Error handler middleware
server.use((err, req, res, next)=>{
  console.log(err);
  if(err instanceof mongoose.Error.ValidationError){
    return res.status(err.code).send(err.message);
  }
  if(err instanceof ApplicationError){
    return res.status(err.code).send(err.message);
  }
  // server errors
  res.status(500).send("Something went wrong, please try later");
});

// Middleware to handle 404 requests
server.use((req, res)=>{
  res.status(404).send("API not found, please check our documentation at localhost:3200/api-docs");
});

// Select the port
server.listen('3200',()=>{
  console.log("Server is listening at port 3200");
  // mongodbConnect();
  connectMongoose();
});