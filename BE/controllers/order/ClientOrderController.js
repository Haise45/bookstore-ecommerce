import ClientOrderService from "../../services/order/ClientOrderService.js";
import ClientBookSerivce from "../../services/book/ClientBookService.js"

const bookService = new ClientBookSerivce();
const clientOrderService = new ClientOrderService();

class ClientOrderController {
  constructor() { }

  async getAllOrders(req, res) {
    try {
      const orders = await clientOrderService.getAllOrders(req);
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
      const order = await clientOrderService.getOrderById(orderId, req);
      if (order) {
        return res.status(res.statusCode).json({
          status: res.statusCode,
          message: "Get order successfully",
          data: await this.responseOrder(order),
        });
      } else {
        return res.status(res.statusCode).json({
          status: res.statusCode,
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
      const status = req.query.s;
      const orders = await clientOrderService.getOrderByStatus(status, req);
      
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

  async cancelOrder(req, res) {
    try {
      const orderId = req.params.orderId;
      await clientOrderService.cancelOrder(orderId, req);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Cancel order successfully",
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
    const book = await bookService.getBookById(bookId);

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
      status: order.status
    };
  }
}

export default ClientOrderController;