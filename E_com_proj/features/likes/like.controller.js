import LikeRepository from "./like.repository.js";

export default class LikeController{
  constructor(){
    this.likeRepository = new LikeRepository();
  }

  async likeItem(req, res, next){
    try{
      const {id, type} = req.body;
      const userID = req.userID;
      if(type!='Product' && type!='Category'){
        return res.status(400).send("Invalid type");
      }
      if(type=='Product'){
        this.likeRepository.likeProduct(userID, id);
        return res.status(200).send("Product has been liked");
      }else{
        this.likeRepository.likeCategory(userID, id);
        return res.status(200).send("Category has been liked");
      }
    }catch(err){
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async getLikes(req, res, next){
    try{
      const {id, type} = req.query;
      const likes = await this.likeRepository.get(id, type);
      return res.status(200).send(likes);
    }catch(err){
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}