import OrderRepository from "../../dao/OrderRepository.js";
import BookRepository from "../../dao/BookRepository.js";
import UserRepository from "../../dao/UserRepository.js";
import PaymentService from "../../services/Payment/PaymentService.js";
const orderRepository = new OrderRepository();
const bookRepository = new BookRepository();
const userRepository = new UserRepository();
const paymentService = new PaymentService();


class ClientOrderServiceImp {

  isUserLoggedIn(req) {
    const authHeader = req.headers.authorization;
    return !!authHeader;
  }

  async getUserFromSession(req) {
    const user = req.session.user;
    const isUser = await this.isUser(user.id);
    if (!isUser) {
      throw new Error("Not the user");
    }
    return user;
  }

  async isUser(userId) {
    const role = await userRepository.getUserRole(userId); 
    if (role === 'User') {
      return true;
    }
    return false;
  }

  async createOrder(userId, cartItem, req) {
    const isLoggedIn = this.isUserLoggedIn(req);
    if (!isLoggedIn) {
      throw new Error("User is not logged in");
    }

    const bookBuffer = cartItem.book.buffer;
    const bookId = bookBuffer.toString('hex');

    const book = await bookRepository.findById(bookId);

    const bookList = [cartItem.book];
    const payment = book.price * cartItem.quantity;

    const paymentOrderId = await paymentService.createPaymentOrder(payment);


    const newOrderData = {
      date: new Date(),
      user: userId,
      bookList,
      payment,
      paymentOrderId,
      status: 'PENDING'
    };

    await orderRepository.user_createOrder(newOrderData);
    return `https://www.paypal.com/checkoutnow?token=${paymentOrderId}`;
  }
  
  async getAllOrders(req) {
    const isLoggedIn = this.isUserLoggedIn(req);
    const user = await this.getUserFromSession(req);
    if (!isLoggedIn) {
      throw new Error("User is not logged in");
    }

    const userId = user.id;
    return await orderRepository.user_getAllOrders(userId);
  }

  async getOrderById(orderId, req) {
    const isLoggedIn = this.isUserLoggedIn(req);
    const user = await this.getUserFromSession(req);

    if (!isLoggedIn) {
      throw new Error("User is not logged in");
    }

    const userId = user.id;
    return await orderRepository.user_getOrderById(userId, orderId);
  }

  async cancelOrder(orderId, req) {
    const isLoggedIn = this.isUserLoggedIn(req);
    const user = await this.getUserFromSession(req);
    if (!isLoggedIn) {
      throw new Error("User is not logged in");
    }

    const userId = user.id;
    const order = await orderRepository.user_getOrderById(userId, orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.status === 'CANCELLED') {
      throw new Error("Order is already cancelled");
    }

    if (order.status !== 'PENDING') {
      throw new Error("Order is not pending");
    }

    await orderRepository.user_cancelOrder(userId, orderId);
  }

  async getOrderByStatus(status, req) {
    const isLoggedIn = this.isUserLoggedIn(req);
    const user = await this.getUserFromSession(req);
    if (!isLoggedIn) {
      throw new Error("User is not logged in");
    }

    const userId = user.id;
    return await orderRepository.user_getOrdersByStatus(userId, status);
  }
}

export default ClientOrderServiceImp;