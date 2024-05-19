import ClientCategoryServiceImp from "./ClientCategoryServiceImp.js";
const clientCategoryService = new ClientCategoryServiceImp();

class ClientCategoryService {
    async getAllCategories (){
        try{
        const categories = await clientCategoryService.getAllCategory();
        return categories;
    }catch(err){
        console.error(err);
    }
    }
}

export default ClientCategoryService;