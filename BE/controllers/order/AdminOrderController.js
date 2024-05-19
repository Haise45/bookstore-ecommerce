import AdminOrderService from "../../services/order/AdminOrderService.js"
import AdminBookService from "../../services/book/AdminBookService.js"

const bookService = new AdminBookService();
const adminOrderService = new AdminOrderService();

class AdminOrderController {
  constructor() { }
  async getAllOrders(req, res) {
    try {
      const orders = await adminOrderService.getAllOrders(req);
      const response = [];

      for (const order of orders) {
        const orderResponse = await this.responseOrder(order);
        response.push(orderResponse);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Get all order successfully",
        data: response,
      });
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }
  async getOrderById(req, res) {
    try {
      const orderId = req.params.orderId;
      const order = await adminOrderService.getOrderById(orderId, req);
      if (order) {
        return res.status(res.statusCode).json({
          status: res.statusCode,
          message: "Get order successfully",
          data: await this.responseOrder(order),
        });
      } else {
        return res.status(404).json({
          status: 404,
          message: "Order not found",
        });
      }
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }
  async getOrderByStatus(req, res) {
    try {
      const status = req.params.status;
      const orders = await adminOrderService.getOrderByStatus(status, req);
      const response = [];

      for (const order of orders) {
        const orderResponse = await this.responseOrder(order);
        response.push(orderResponse);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Get order by status successfully",
        data: response,
      });
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }
  async getOrderByUser(req, res) {
    try {
      const userId = req.params.userId;
      const orders = await adminOrderService.getOrderByUser(userId, req);
      const response = [];

      for (const order of orders) {
        const orderResponse = await this.responseOrder(order);
        response.push(orderResponse);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Get order by status successfully",
        data: response,
      });
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }
  async updateOrders(req, res) {
    try {
      const orderId = req.params.orderId;
      const status = req.query.status;
      await adminOrderService.updateOrder(orderId, status, req);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Update status successfully"
      });
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }
  async responseOrder(order) {
    const bookList = order.bookList[0].buffer;
    const bookId = bookList.toString('hex');
    const book = await bookService.findById(bookId);

    return {
      _id: order._id,
      date: order.date,
      payment: order.payment,
      bookList: {
        _id: bookId,
        price: book.price,
        bookImage: book.image,
        name: book.name,
        author: book.author,
        description: book.description,
        categoriesSet: book.categories
      },
      user_id: order.user,
      status: order.status
    };
  }
}

export default AdminOrderController;