import ClientCategoryService from "../../services/category/ClientCategoryService.js";
const clientCategoryService = new ClientCategoryService();

class ClientCategoryController {
    constructor(){}

    async getCategories(req, res){
        try{
            const categories = await clientCategoryService.getAllCategories();
            const response = categories.map(category => this.responseCategory(category));
            return res.status(res.statusCode).json({
                status: res.statusCode,
                message : "Successfully retrieved data",
                data : response,
            });
        } catch(err){
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
export default ClientCategoryController;