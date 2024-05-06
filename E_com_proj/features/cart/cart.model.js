// userID, productID, quantity

export default class CartModel{
  constructor(userID, productID, quantity, id){
    this.userID = userID;
    this.productID = productID;
    this.quantity = quantity;
    this.id = id;
  }

  static add(userID, productID, quantity){
    const cartItem = new CartModel(userID, productID, quantity);
    cartItem.id = cartItems.length+1;
    cartItems.push(cartItem);
    return cartItem;
  }

  static getAll(){
    return cartItems;
  }

  static get(userID){
    return cartItems.filter(i=> i.id == userID);
  }

  static delete(cartItemID, userID){
    const cartItemIndex = cartItems.findIndex(i=> i.id == cartItemID && i.userID == userID);
    if(cartItemIndex == -1){
      return "Item not found";
    } else {
      cartItems.splice(cartItemID, 1);
    }
  }
}

let cartItems = [
  new CartModel(1, 2, 1, 1),
  new CartModel(1, 1, 2, 2)
];