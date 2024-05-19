import CartService from "../services/cart/CartService.js"
import ClientBookSerivce from "../services/book/ClientBookService.js"
const bookService = new ClientBookSerivce();

class CartController {
  constructor() {
    this._cartService = new CartService();
  }

  async addToCart(req, res,next) {
    try {
      const bookId = req.params.bookId;
      let quantity = req.params.quantity;
      if (quantity == undefined) {
        quantity = 1;
      }
      await this._cartService.addToCart(req, bookId, quantity);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Successfully add to cart",
      });
    } catch (err) {
      next(err);
    }
  }

  async getCart(req, res, next) {
    try {
      const cart = await this._cartService.getCart(req);
      const response = [];

      for (const cartItem of cart) {
        const cartResponse = await this.responseCart(cartItem);
        response.push(cartResponse);
      }

      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Successfully retrieved data",
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async getCartItem(req, res, next) {
    try {
      const cartItemId = req.params.cartItemId;
      const cart = await this._cartService.getCartItem(cartItemId, req);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: 'Get cart successfully',
        data: await this.responseCart(cart)
      });
    } catch (err) {
      next(err);
    }
  }

  async removeFromCart(req, res, next) {
    try {
      const bookId = req.params.bookId;
      await this._cartService.removeFromCart(req, bookId);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: 'Remove from cart successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCart(req, res, next) {
    try {
      const bookId = req.params.bookId;
      const quantity = req.params.quantity;
      await this._cartService.updateCart(req, bookId, quantity);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: 'Update cart successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async clearCart(req, res, next) {
    try {
      await this._cartService.clearCart(req);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: 'Clear cart successfully'
      });
    } catch (err) {
      next(err);
    }
  }
  async checkout(req, res, next) {
    try {
      const cartItemId = req.params.cartItemId;
      const url = await this._cartService.checkout(cartItemId, req);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: 'Checkout cart successfully',
        url: url
      });
    } catch (err) {
      next(err);
    }
  }
  async responseCart(cartItem) {
    const bookList = cartItem.book.buffer;
    let bookId;
    if(bookList){
      bookId = bookList.toString('hex');
    } else {
      bookId = cartItem.book;
    }
    
    const book = await bookService.getBookById(bookId);
    return {
      _id: cartItem._id,
      quantity: cartItem.quantity,
      cart: {
        _id: cartItem.cart
      },
      book: {
        _id: cartItem.book,
        price: book.price,
        bookImage: book.image,
        name: book.name,
        author: book.author,
        description: book.description,
        categoriesSet: book.categories
      }
    }
  }
}
export default CartController;