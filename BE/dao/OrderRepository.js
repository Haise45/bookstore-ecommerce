import Order from "../models/order.js";

class OrderRepository {
  constructor() {}

  //user
  async user_createOrder(orderData) {
    try {
      const order = new Order(orderData);
      return await order.save();
    } catch (err) {
      throw new Error(`Failed to create order: ${err.message}`);
    }
  }

  async user_getAllOrders(userId) {
    try {
      return await Order.find({ user: userId });
    } catch (err) {
      throw new Error(`Failed to get all orders for user ${userId}: ${err.message}`);
    }
  }

  async user_getOrderById(userId, orderId) {
    try {
      return await Order.findOne({ _id: orderId, user: userId });
    } catch (err) {
      throw new Error(`Failed to get order ${orderId} for user ${userId}: ${err.message}`);
    }
  }

  async user_getOrdersByStatus(userId, status) {
    try {
      const regex = new RegExp(status, 'i');
      return await Order.find({ user: userId, status: regex });
    } catch (err) {
      throw new Error(`Failed to get orders with status ${status} for user ${userId}: ${err.message}`);
    }
  }

  async user_cancelOrder(userId, orderId) {
    try {
      return await Order.findOneAndUpdate({ _id: orderId, user: userId }, { status: 'CANCELLED' }, { new: true });
    } catch (err) {
      throw new Error(`Failed to cancel order ${orderId} for user ${userId}: ${err.message}`);
    }
  }

  //admin

  async admin_updateOrder(orderId, status) {
    try {
      return await Order.findOneAndUpdate({ _id: orderId }, { status: status }, { new: true });
    } catch (err) {
      throw new Error(`Failed to update order ${orderId}: ${err.message}`);
    }
  }

  async admin_getAllOrders(){
    try {
      return await Order.find();
    } catch (err) {
      throw new Error(`Failed to get all orders: ${err.message}`);
    }
  }

  async admin_getOrderById(orderId) {
    try {
      return await Order.findOne({ _id: orderId });
    } catch (err) {
      throw new Error(`Failed to find order ${orderId}: ${err.message}`);
    }
  }

  async admin_getOrdersByStatus(status) {
    try {
      const regex = new RegExp(status, 'i');
      return await Order.find({ status: regex });
    } catch (err) {
      throw new Error(`Failed to find orders with status ${status}: ${err.message}`);
    }
  }

  async admin_getOrdersByUser(userId) {
    try {
      return await Order.find({ user: userId });
    } catch (err) {
      throw new Error(`Failed to find orders for user ${userId}: ${err.message}`);
    }
  }
}


export default OrderRepository;