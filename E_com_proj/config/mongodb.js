import { MongoClient } from "mongodb";
import '../../env.js'

const url = process.env.DB_URL; // IPv6
// "mongodb://127.0.0.1:27017/ecomDB" // IPv4

let client;
export const mongodbConnect = ()=>{
  MongoClient.connect(url).then(clientInstance=>{
    client = clientInstance;
    console.log("MongoDB is connected");
    createCounter(client.db());
    createIndex(client.db());
  }).catch(err=>{
    console.log(err);
  });
}

const asyncConnect = async ()=>{
  try{
    await MongoClient.connect(url);
    console.log("Connected to MongoDB");
  }catch(err){
    console.log(err);
  }
}

export const getDB = ()=>{
  return client.db();
}

export const getClient = ()=>{
  return client;
}

const createCounter = async (db)=>{
  const existingCounter = await db.collection("counters").findOne({_id:'cartItemID'});
  if(!existingCounter){
    await db.collection("counters").insertOne({_id:'cartItemID', value:0});
  }
}

const createIndex = async (db)=>{
  try{
    await db.collection("products").createIndex({price:1});
    await db.collection("products").createIndex({name:1, category:-1});
    await db.collection("products").createIndex({desc:"text"});
  }catch(err){
    console.log(err.message);
  }
  console.log("Indexes are created");
}