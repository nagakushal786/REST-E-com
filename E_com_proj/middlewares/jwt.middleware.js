import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next)=>{
  // 1. Read the token
  const token = req.headers["authorization"];
  console.log(token);

  // 2. If no token, return the error
  if(!token){
    return res.status(401).send("Unauthorized");
  }

  // 3. Check if token is valid
  try{
    const payLoad = jwt.verify(token, "HqukYfNHMP18G5Cg95EtqQuiJ78MYEJR");
    req.userID = payLoad.userID;
    console.log(payLoad);
  } catch(err) {
    // 4. Return the error
    console.log(err);
    return res.status(401).send("Unauthorized"); 
  }

  // 5. Call next middleware
  next();
}

export default jwtAuth;