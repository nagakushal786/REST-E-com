// To log our requests so that we can know what user is exactly sending
import fs from "fs";

// Helps us to write content into the file synchronously without callbacks
const fsPromises = fs.promises;

async function log(logData){
  try{
    logData = `\n ${new Date().toString()} - ${logData}`;
    await fsPromises.appendFile('log.txt', logData);
  } catch(err) {
    console.log(err);
  }
}

const loggerMiddleware = async (req, res, next)=>{
  // 1. Log the request
  if(!req.url.includes('signin')){
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    await log(logData);
  }
  next();
}

export default loggerMiddleware;