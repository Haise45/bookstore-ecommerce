import { Router } from "express";
import ClientOrderController from "../../../controllers/order/ClientOrderController.js";

const order = Router();
const orderController = new ClientOrderController();

order.get('/getAll', orderController.getAllOrders.bind(orderController));
order.get('/:orderId', orderController.getOrderById.bind(orderController));
order.get('', orderController.getOrderByStatus.bind(orderController));

order.post('/:orderId', orderController.cancelOrder.bind(orderController));

export default order;