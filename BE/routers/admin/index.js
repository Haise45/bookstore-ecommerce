import { Router } from "express";
import user from './user/index.js'
import categoryRouter from "./category/index.js";
import bookRouter from "./book/index.js"
import order from "./order/index.js";

const routerAdmin = Router();

routerAdmin.use('/user',user)
routerAdmin.use('/category',categoryRouter);
routerAdmin.use('/book', bookRouter)
routerAdmin.use('/order', order);

export default routerAdmin;