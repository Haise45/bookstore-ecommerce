import { Router } from "express";
import ClientCategoryController from "../../../controllers/category/ClientCategoryController.js";

const categoryRouter = Router();
const categoryController = new ClientCategoryController();

categoryRouter.get('/getAll', categoryController.getCategories.bind(categoryController));

export default categoryRouter;