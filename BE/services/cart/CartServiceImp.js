import CartRepository from '../../dao/cart/cartRepository.js';
import CartItemRepository from '../../dao/cart/cartItemRepository.js';
import AdminBookServiceImp from '../book/AdminBookServiceImp.js';
import CartItem from "../../models/cart/cartItem.js";
import ClientOrderService from '../order/ClientOrderService.js';
import ErrorRepsonse from '../../responses/ErrorResponse.js';
const SESSION_KEY_CART = 'CART';
const cartRepository = new CartRepository();
const cartItemRepository = new CartItemRepository();
const adminBookServiceImp = new AdminBookServiceImp();
const clientOrderService = new ClientOrderService();

class CartServiceImp {

  getCartFromSession(req) {
    try {
      let cartMap = req.session[SESSION_KEY_CART];
      if (!cartMap) {
        cartMap = {};
        req.session[SESSION_KEY_CART] = cartMap;
      }
      return cartMap;
    } catch (error) {
      console.error('Error not found cart:', error);
      throw error;
    }
  }

  isUserLoggedIn(req) {
    try {
      const authHeader = req.headers.authorization;
      return !!authHeader;
    } catch (error) {
      console.error('Error user not logged in:', error);
      throw error;
    }
  }

  getUserId(req) {
    try {
      if (!this.isUserLoggedIn(req)) {
        return null;
      }
      return req.session.user.id;
    } catch (error) {
      console.error('Error not found user id:', error);
      throw error;
    }
  }

  async getCartFromDatabase(userId) {
    try {
      const cart = await cartRepository.findByUserId(userId);
      if (!cart){
        await cartRepository.create({
          user: userId,
          cartItem: []
        });
      }
      const cartMap = {};
  
      if (cart && cart.cartItems) {
        cart.cartItems.forEach(item => {
          if(item.book){
            cartMap[item.book._id] = item;
          }
        });
      }
      return cartMap;
    } catch (error) {
      console.error('Error not found cart in database:', error);
      throw error;
    }
  }

  async storeCartInDatabase(userId, cartMap) {
    try{
      const cart = await cartRepository.findByUserId(userId);

      const newCartItems = [];
      const updatedCartItems = [];

      for (const [bookId, cartItem] of Object.entries(cartMap)) {
        const existingItem = cart?.cartItems.find(item => item.book.toString() === bookId);
        if (existingItem) {
          existingItem.quantity = cartItem.quantity;
          updatedCartItems.push(existingItem);
        } else {
          const book = await adminBookServiceImp.findById(bookId);
          const newItem = new CartItem({ book, quantity: cartItem.quantity, cart: cart._id });
          newCartItems.push(newItem);
        }
      }

      const itemIdsToRemove = cart.cartItems
        .filter(item => !updatedCartItems.includes(item))
        .map(item => item._id);

      await cartItemRepository.deleteCart(itemIdsToRemove);
      await Promise.all(updatedCartItems.map(item => cartItemRepository.updateCartItem(item._id, item.quantity)));
      await Promise.all(newCartItems.map(item => cartItemRepository.createCartItem(item)));

      cart.cartItems = [...updatedCartItems, ...newCartItems].map(item => item._id);
      await cartRepository.update(cart._id,cart);
    } catch ( error)
    {
      console.error('Error can not store cart into data base:', error);
      throw error;
    }
  }

  async addToCart(req, bookId, quantity) {
    try{
      const isLoggedIn = this.isUserLoggedIn(req);

      if (isLoggedIn) {
        const userId = await this.getUserId(req);
        let cartMap = await this.getCartFromDatabase(userId);
        let cartItem = cartMap[bookId];
        if (cartItem) {
          cartItem.quantity =(parseInt(cartItem.quantity) + parseInt(quantity)).toString();
        } else {
          cartItem = { book: bookId, quantity };
          cartMap[bookId] = cartItem;
        }
        await this.storeCartInDatabase(userId, cartMap);
      } else {
        const cartMap = this.getCartFromSession(req);
        let cartItem = cartMap[bookId];
        if (cartItem) {
          cartItem.quantity =(parseInt(cartItem.quantity) + parseInt(quantity)).toString();
        } else {
          cartItem = { book: bookId, quantity };
          cartMap[bookId] = cartItem;
        }
        req.session[SESSION_KEY_CART] = cartMap;
      }
    } catch (error) {
      if (error instanceof ErrorRepsonse) {
        throw error;
      } else {
        throw new ErrorRepsonse(500, 'Internal Server Error', error);
      }
    }
  }

  async removeFromCart(req, bookId) {
    try{
      const isLoggedIn = this.isUserLoggedIn(req);

      if (isLoggedIn) {
        const userId = await this.getUserId(req);
        const cartMap = await this.getCartFromDatabase(userId);
        const itemToRemove = cartMap[bookId];
        if (itemToRemove) {
          await cartItemRepository.deleteCartItem(itemToRemove._id);
          delete cartMap[bookId];
          await this.storeCartInDatabase(userId, cartMap);
        }
      } else {
        const cartMap = this.getCartFromSession(req);
        delete cartMap[bookId];
        req.session[SESSION_KEY_CART] = cartMap;
      }
    } catch (error) {
      if (error instanceof ErrorRepsonse) {
        throw error;
      } else {
        throw new ErrorRepsonse(500, 'Internal Server Error', error);
      }
    }
  }

  async updateCart(req, bookId, quantity) {
    try{
      const isLoggedIn = this.isUserLoggedIn(req);

      if (isLoggedIn) {
        const userId = await this.getUserId(req);
        const cartMap = await this.getCartFromDatabase(userId);
        const cartItem = cartMap[bookId];
        if (cartItem) {
          cartItem.quantity = quantity;
          await this.storeCartInDatabase(userId, cartMap);
        }
      } else {
        const cartMap = this.getCartFromSession(req);
        const cartItem = cartMap[bookId];
        if (cartItem) {
          cartItem.quantity = quantity;
        }
        req.session[SESSION_KEY_CART] = cartMap;
      }
    } catch (error) {
      if (error instanceof ErrorRepsonse) {
        throw error;
      } else {
        throw new ErrorRepsonse(500, 'Internal Server Error', error);
      }
    }
  }

  async clearCart(req) {
    try{
      const session = req.session;
      const isLoggedIn = this.isUserLoggedIn(req);

      if (isLoggedIn) {
        const userId = await this.getUserId(req);
        const cart = await cartRepository.findByUserId(userId);
        if (cart) {
          await cartItemRepository.deleteCart(cart._id);
          cart.cartItems = [];
          await cartRepository.update(cart);
        }
      } else {
        const cartMap = this.getCartFromSession(req);
        cartMap = {};
        req.session[SESSION_KEY_CART] = cartMap;
      }
    } catch (error) {
      if (error instanceof ErrorRepsonse) {
        throw error;
      } else {
        throw new ErrorRepsonse(500, 'Internal Server Error', error);
      }
    }
  }

  async getCart(req) {
    try{
      const isLoggedIn = this.isUserLoggedIn(req);
      
      if (isLoggedIn) {
        const userId = this.getUserId(req);
        const cartMap = await this.getCartFromDatabase(userId);
        return Object.values(cartMap);
      } else {
        const cartMap = this.getCartFromSession(req);
        return Object.values(cartMap);
      }
    } catch (error) {
      if (error instanceof ErrorRepsonse) {
        throw error;
      } else {
        throw new ErrorRepsonse(500, 'Internal Server Error', error);
      }
    }
  }
  async getCartItem(cartItemId, req) {
    try{
      const isLoggedIn = this.isUserLoggedIn(req);
      
      if (isLoggedIn) {
        const userId = this.getUserId(req);
        const cartMap = await this.getCartFromDatabase(userId);
        const cartItem = Object.values(cartMap).find(
          (model) => model._doc._id.equals(cartItemId)
        );
    
        if(cartItem)
          return cartItem;
        else{
          throw new ErrorRepsonse(404, "Not Fould CartItem")
        }
      } else {
        const cartMap = this.getCartFromSession(req);
    
        const cartItem = Object.values(cartMap).find(
          (model) => model._doc._id.equals(cartItemId)
        );
    
        if(cartItem)
          return cartItem;
        else{
          throw new ErrorRepsonse(404, "Not Fould CartItem")
        }
      }
    } catch (error) {
      if (error instanceof ErrorRepsonse) {
        throw error;
      } else {
        throw new ErrorRepsonse(500, 'Internal Server Error', error);
      }
    }
  }
  
  async createCart(cart){
    try{
      return await cartRepository.create(cart);
    } catch( error){
      console.error('Error cant create cart:', error);
      throw error;
    }
  }
  async checkout(cartItemId, req) {
    const isLoggedIn = this.isUserLoggedIn(req);
    
    if (!isLoggedIn) {
      throw new Error('User must be logged in to checkout');
    }
    
    const cartItem = await this.getCartItem(cartItemId, req);
    const bookBuffer = cartItem.book.buffer;
    const bookId = bookBuffer.toString('hex');
    
    if (!cartItem) {
      throw new Error('Cart item not found');
    }
    
    try {
      const userId = this.getUserId(req);
      const order = await clientOrderService.createOrder(userId, cartItem, req);
      await this.removeFromCart(req, bookId);
      return order;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default CartServiceImp;