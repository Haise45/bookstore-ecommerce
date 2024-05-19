import CategoryRepository from "../../dao/CategoryRepository.js";

const categoryRepository = new CategoryRepository();

class AddminCategoryServiceImp {
    async findById(id){
        try{
            const category = await categoryRepository.findById(id);
            return category;
        } catch(err){
            console.error(err);
            throw new Error("Not Found by id category");
        }
    }
    async updateCategory(id, category){
        try{
            const updateCategory = await categoryRepository.findByIdAndUpdate(id, category,{new : true});
            return updateCategory;
        }catch (err){
            console.error(err);
            throw new Error("Not update category");
        }
    }
    async addCategory(category){
        try{
            const newCategory = await categoryRepository.create(category);
            return newCategory;
        }catch (err){
            console.error(err);
            throw new Error("Error adding the category");
        }
    }    
    async removeCategory(id){
        try{
             await categoryRepository.findByIdAndDelete(id);
        }catch (err){
            console.error(err);
            throw new Error("Not delete category");
        }
    }
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

export default AddminCategoryServiceImp;