import OrderRepository from "../../dao/OrderRepository.js";
import UserRepository from "../../dao/UserRepository.js";

const orderRepository = new OrderRepository();
const userRepository = new UserRepository();

class AdminOrderServiceImp {

    isUserLoggedIn(req) {
        const authHeader = req.headers.authorization;
        return !!authHeader;
    }
    
    async getUserFromSession(req) {
        if (!this.isUserLoggedIn(req)) {
          throw new Error("User is not logged in");
        }
        const user = req.session.user;
        const isUser = await this.isUser(user.id);
        if (!isUser) {
          throw new Error("Not the user");
        }
        return user;
    }
    
    async isUser(userId) {
        const role = await userRepository.getUserRole(userId); 
        if (role === 'Admin') {
          return true;
        }
        return false;
    }

    async getAllOrders(req) {
        try {
            const user = await this.getUserFromSession(req);
            const orders = await orderRepository.admin_getAllOrders();
            return orders;
        } catch (error) {
            console.error(err);
            throw new Error("Not Found by id category");
        }
    }
    async getOrderById(orderId, req){
        try {
            const user = await this.getUserFromSession(req);
            const order = await orderRepository.admin_getOrderById(orderId);
            return order;
        } catch (error) {
            console.error(err);
            throw new Error("Not Found by id");
        }
    }

    async getOrderByStatus(status, req){
        try {
            const user = await this.getUserFromSession(req);
            const order = await orderRepository.admin_getOrdersByStatus(status);
            return order;
        } catch (error) {
            console.error(err);
            throw new Error("Not Found by status");
        }
    }

    async getOrderByUser(userId, req) {
        try {
            const user = await this.getUserFromSession(req);
            const order = await orderRepository.admin_getOrdersByUser(userId);
            return order;
        } catch (error) {
            console.error(err);
            throw new Error("Not Found by id category");
        }
    }

    async updateOrder(oderId, status, req) {
        try {
            const user = await this.getUserFromSession(req);
            const str = status.toUpperCase();
            await orderRepository.admin_updateOrder(oderId, str);
        } catch (error) {
            console.error(err);
            throw new Error("Not Found by id category");
        }
    }
}

export default AdminOrderServiceImp;