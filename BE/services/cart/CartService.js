import CartServiceImp from "../../services/cart/CartServiceImp.js";
const cartServiceImp = new CartServiceImp();

class CartService {
    async addToCart(req, bookId, quantity){
        return await cartServiceImp.addToCart(req, bookId, quantity);
    }
    async getCart(req) {
        return await cartServiceImp.getCart(req);
    }
    async getCartItem(cartItemId, req){
        return await cartServiceImp.getCartItem(cartItemId, req);
    }
    async removeFromCart(req, bookId) {
        return await cartServiceImp.removeFromCart(req, bookId);
    }
    async updateCart(req, bookId, quantity) {
        return await cartServiceImp.updateCart(req, bookId, quantity);
    }
    async clearCart(req) {
        return await cartServiceImp.clearCart(req);
    }
    async checkout(cartItemId, req){
        return await cartServiceImp.checkout(cartItemId, req);
    }
}
export default CartService;