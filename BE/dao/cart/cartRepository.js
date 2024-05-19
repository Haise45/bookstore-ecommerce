import mongoose from 'mongoose';
import Cart from "../../models/cart/cart.js"
class CartRepository {
  constructor() {
  }

  async findByUserId(userId) {
    return await Cart.findOne({ user: userId }).populate('cartItems');
  }

  async create(cartData) {
    const cart = new Cart(cartData);
    return await cart.save();
  }

  async update(cartId,cart) {
    return await Cart.findByIdAndUpdate(cartId, cart, { new: true });
  }
  async deleteByUserId(userId) {
    return await Cart.findOneAndDelete({ user: userId });
  }
}

export default CartRepository;