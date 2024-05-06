import ProductModel from "./product.model.js";
import ProductRepo from "./product.repository.js";

export default class ProductController{

    constructor(){
        this.productRepository = new ProductRepo();
    }

    async getAllProducts(req, res){
        try{
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        }catch(err){
            return res.status(400).send("Something went wrong");
        }
    }

    async addProduct(req, res){
        try{
            const {name, price, desc, category, sizes} = req.body;
            const newProduct = new ProductModel(name, desc, parseFloat(price), req?.file?.filename, category, sizes?.split(','));
            newProduct.categories = newProduct.category.split(',');
            const createdRecord = await this.productRepository.addProduct(newProduct);
            return res.status(201).send(createdRecord);
        }catch(err){
            return res.status(400).send("Something went wrong");
        }
    }

    rateProduct(req, res, next){
        console.log(req.query);
        try{
            const userID = req.userID;
            const productID = req.query.productID;
            const rating = req.query.rating;
            this.productRepository.rate(userID, productID, rating);
            return res.status(200).send("Rating has been added");
        } catch(err) {
            console.log("Passing error to middleware");
            next(err);
        }  
    }

    async getOneProduct(req, res){
        try{
            const id = req.params.id;
            const product = await this.productRepository.get(id);
            if(!product){
                res.status(404).send('Product not found');
            }else{
                res.status(200).send(product);
            }
        }catch(err){
            return res.status(400).send("Something went wrong");
        }
    }

    async filterProducts(req, res) {
        try{
            const minPrice = req.query.minPrice;
            const maxPrice = req.query.maxPrice;
            const category = req.query.category;
            const categories = req.query.categories; // For $in operator
            const result = await this.productRepository.filter(minPrice, maxPrice, category);
            res.status(200).send(result);
        }catch(err){
            return res.status(400).send("Something went wrong");
        }
    }

    async averagePrice(req, res, next){
        try{
            const result = await this.productRepository.avgProPricePerCat();
            return res.status(200).send(result);
        }catch(err){
            return res.status(400).send("Something went wrong");
        }
    }
}