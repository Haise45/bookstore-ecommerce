import { Router } from "express";
import AdminCategoryController from "../../../controllers/category/AdminCategoryController.js";

const categoryRouter = new Router();
const adminCategoryController = new AdminCategoryController();

categoryRouter.get('/getAll', adminCategoryController.getCategories.bind(adminCategoryController));
categoryRouter.get('/:id', adminCategoryController.getCategoryById.bind(adminCategoryController));
categoryRouter.post('/add',adminCategoryController.addCategory.bind(adminCategoryController));
categoryRouter.patch('/update/:id',adminCategoryController.updateCategory.bind(adminCategoryController));
categoryRouter.delete('/delete/:id',adminCategoryController.removeCategory.bind(adminCategoryController));

export default categoryRouter;