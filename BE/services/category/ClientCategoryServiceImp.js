import CategoryRepository from "../../dao/CategoryRepository.js";
const categoryRepository = new CategoryRepository();

class ClientCategoryServiceImp {
    async getAllCategory(){
        try{
            const category = await categoryRepository.findAll();
            return category;
        }catch (err){
            console.error(err);
            throw new Error("Not getting all category");
        }
    }
}

export default ClientCategoryServiceImp;