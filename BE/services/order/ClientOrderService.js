import ClientOrderServiceImp from "../../services/order/ClientOrderServiceImp.js";
const clientOrderServiceImp = new ClientOrderServiceImp();

class ClientOrderService {
    async createOrder(userId, cartItem, req){
        const order = await clientOrderServiceImp.createOrder(userId, cartItem, req);
        return order;
    }
    async getAllOrders(req){
        const orders = await clientOrderServiceImp.getAllOrders(req);
        return orders;
    }
    async getOrderById(orderId, req){
        const order = await clientOrderServiceImp.getOrderById(orderId, req);
        return order;
    }
    async getOrderByStatus(status, req){
        const orders = await clientOrderServiceImp.getOrderByStatus(status, req);
        return orders;
    }
    async cancelOrder(orderId, req){
        await clientOrderServiceImp.cancelOrder(orderId, req);
    }
}

export default ClientOrderService;