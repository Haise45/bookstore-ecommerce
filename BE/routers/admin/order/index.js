import { Router } from "express";
import AdminOrderController from "../../../controllers/order/AdminOrderController.js";

const order = Router();
const orderController = new AdminOrderController();

order.get('/getAll', orderController.getAllOrders.bind(orderController));

order.get('/status/:status', orderController.getOrderByStatus.bind(orderController));
order.get('/:orderId', orderController.getOrderById.bind(orderController));
order.get('/user/:userId', orderController.getOrderByUser.bind(orderController));


order.post('/update/:orderId', orderController.updateOrders.bind(orderController));

export default order;