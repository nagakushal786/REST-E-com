// To log our requests so that we can know what user is exactly sending
import fs from "fs";
import winston from "winston";

// Helps us to write content into the file synchronously without callbacks
const fsPromises = fs.promises;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: {service: "request-logging"},
  transports: [
    new winston.transports.File({filename:"logs.txt"})
  ]
});

const winstonloggerMiddleware = async (req, res, next)=>{
  // 1. Log the request
  if(!req.url.includes('signin')){
    const logData = `${req.url} - ${JSON.stringify(req.body)}`;
    logger.info(logData);
  }
  next();
}

export default winstonloggerMiddleware;