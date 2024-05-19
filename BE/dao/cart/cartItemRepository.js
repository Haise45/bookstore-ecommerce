import CartItem from "../../models/cart/cartItem.js"
class cartItemRepository{
    contructor(){}
    async createCartItem(cartItem){
        return await cartItem.save();
    }
    async updateCartItem(cartItemId, newQuantity){
        return await CartItem.findByIdAndUpdate(cartItemId,  {$set: {quantity: newQuantity}}, {new: true});
    }
    async deleteCartItem(cartItemId){
        return await CartItem.findByIdAndDelete(cartItemId);
    }
    async findCartById(cartItemId){
        return await CartItem.findById(cartItemId);
    }
    async findCartItemByCart(cartId){
        return await CartItem.find({ cart: cartId}).populate('book')
    }
    async deleteCart(cartId){
        return await CartItem.deleteMany({cart: cartId});
    }
} export default cartItemRepository;