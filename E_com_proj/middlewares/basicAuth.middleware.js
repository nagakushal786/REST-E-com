import UserModel from "../features/users/user.model.js";

const basicAuth = (req, res, next)=>{

  // 1. Check if the authorization header is empty
  const authHeader = req.headers["authorization"];

  if(!authHeader){
    // 401 - request is unauthorized
    return res.status(401).send("No authorization details found");
  }
  console.log(authHeader);

  // 2. Extract the credentials - [Basic dkjiorejfjr9u549jt593090kff]
  const base64Credentials = authHeader.replace('Basic ','');
  console.log(base64Credentials);

  // 3. Decode credentials
  const decodeCred = Buffer.from(base64Credentials, 'base64').toString('utf8');
  console.log(decodeCred); // [username:password]
  const creds = decodeCred.split(":"); // [username, password]
  
  const user = UserModel.getAll().find((u)=>{
    u.email == creds[0] && u.password == creds[1]
  });
  if(user){
    next();
  } else {
    return res.status(401).send("Incorrect credentials");
  }
}

export default basicAuth;