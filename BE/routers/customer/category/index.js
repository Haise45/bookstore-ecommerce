import { Router } from "express";
import ClientCategoryController from "../../../controllers/category/ClientCategoryController.js";

const categoryRouter = Router();
const categoryController = new ClientCategoryController();

categoryRouter.get('/getAll', categoryController.getCategories);

export default categoryRouter;