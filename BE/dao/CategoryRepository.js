import Category from '../models/category.js';

class CategoryRepository {
  constructor() {}

  async findAll() {
    const categories = await Category.find().populate({
        path: 'books',
        select: 'name'
    }); 
    return categories;
  }

  async findByName(name) {
    try {
      const category = await Category.findOne({ name }).populate({
        path: 'books',
        select: 'name'
    }); 
      return category;
    } catch (err) {
      console.error(err);
      throw new Error('Error finding category by name');
    }
  }

  async findById(id) {
    try {
      const category = await Category.findById(id).populate({
        path: 'books',
        select: 'name'
    }); 
      if (!category) {
        return null;
      }
      return category;
    } catch (err) {
      console.error(err);
      throw new Error('Error finding category by id');
    }
  }

  async create(categoryData) {
    try {
      const newCategory = new Category(categoryData);
      const savedCategory = await newCategory.save();
      return savedCategory;
    } catch (err) {
      console.error(err);
      throw new Error('Error adding the category');
    }
  }

  async populate(model) {
    try {
      const object = await Category.populate(model);
      return object;
    } catch (err) {
      console.error(err);
      throw new Error('Error populate objejct the category');
    }
  }

  async findByIdAndUpdate(id, categoryData) {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, { new: true });
      return updatedCategory;
    } catch (err) {
      console.error(err);
      throw new Error('Error updating the category');
    }
  }

  async findByIdAndDelete(id) {
    try {
      await Category.findByIdAndDelete(id);
    } catch (err) {
      console.error(err);
      throw new Error('Error deleting the category');
    }
  }

}

export default CategoryRepository;
