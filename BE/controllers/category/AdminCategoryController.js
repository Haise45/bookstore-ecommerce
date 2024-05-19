import AdminCategoryService from "../../services/category/AdminCategoryService.js";
const adminCategoryService = new AdminCategoryService();

class AdminCategoryController {
    constructor() { }

    async getCategories(req, res) {
        try {
            const categories = await adminCategoryService.getAllCategory();
            const response = categories.map(category => this.responseCategory(category));
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: "Successfully retrieved data",
                data: response,
            });
        } catch (err) {
            let errorMessage = err.message;
            if (errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.slice(7);
            }
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: errorMessage,
            });
        }
    }

    async getCategoryById(req, res) {
        try {
            const categoryId = req.params.id;
            const category = await adminCategoryService.finById(categoryId);
            if (!category) {
                return res.status(res.statusCode).json({
                    status: res.statusCode,
                    message: "Category not found",
                });
            }
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: "Successfully retrieved the category",
                data: this.responseCategory(category),
            });
        } catch (err) {
            let errorMessage = err.message;
            if (errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.slice(7);
            }
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: errorMessage,
            });
        }
    }
    async addCategory(req, res) {
        try {
            const newcategory = req.body;
            await adminCategoryService.addCategory(newcategory);
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: "Category added successfully",
            });
        } catch (err) {
            let errorMessage = err.message;
            if (errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.slice(7);
            }
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: errorMessage,
            });
        }
    }
    async updateCategory(req, res) {
        try {
            const categoryId = req.params.id;
            const updatecategory = req.body;
            await adminCategoryService.updateCategory(categoryId, updatecategory);
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: "Category uppdated successfully",
            });
        } catch (err) {
            let errorMessage = err.message;
            if (errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.slice(7);
            }
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: errorMessage,
            });
        }
    }
    async removeCategory(req, res) {
        try {
            const categoryId = req.params.id;
            await adminCategoryService.removeCategory(categoryId);
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: "Category removed successfully",
            });
        } catch (err) {
            let errorMessage = err.message;
            if (errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.slice(7);
            }
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message: errorMessage,
            });
        }
    }

    responseCategory(category) {
        return {
            _id: category._id,
            name: category.name
        }
    }
}

export default AdminCategoryController;
