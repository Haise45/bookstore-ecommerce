import AdminOrderServiceImp from "../../services/order/AdminOrderServiceImp.js";
const adminOrderServiceImp = new AdminOrderServiceImp();

class AdminOrderService {
    async getAllOrders(req) {
        const order = await adminOrderServiceImp.getAllOrders(req);
        return order;
    }
    async getOrderById(orderId, req) {
        const order = await adminOrderServiceImp.getOrderById(orderId, req);
        return order;
    }
    async getOrderByStatus(status, req){
        const orders = await adminOrderServiceImp.getOrderByStatus(status, req);
        return orders;
    }
    async getOrderByUser(userId, req){
        const orders = await adminOrderServiceImp.getOrderByUser(userId, req);
        return orders;
    }
    async updateOrder(oderId, status, req){
        const orders = await adminOrderServiceImp.updateOrder(oderId, status, req);
        return orders;
    }
}

export default AdminOrderService;