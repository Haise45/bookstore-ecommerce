import Book from '../models/book.js';
import Category from '../models/category.js';

class BookRepository {
  constructor() {}

  async create(bookData) {
    try {
      const newBook = new Book(bookData);
  
      for (const categoryId of bookData.categories) {
        const category = await Category.findByIdAndUpdate(categoryId, { $push: { books: newBook._id } }, { new: true }); // Update category with book's Id
        if (!category) {
          throw new Error(`Category with id ${categoryId} not found`);
        }
      }
  
      const book = await newBook.save();
      return book;
    } catch (err) {
      console.error(err);
      throw new Error('Error creating book');
    }
  }

  async findAll() {
    const books = await Book.find().populate({
      path: 'categories',
      select: 'name'
    });
    return books;
  }

  async findByName(name) {
    try {
      const book = await Book.findOne({ name }).populate({
        path: 'categories',
        select: 'name',
        options: { lean: true }
      });
      return book;
    } catch (err) {
      console.error(err);
      throw new Error('Error finding book by name');
    }
  }

  async findById(id) {
    try {
      const book = await Book.findById(id).populate({
        path: 'categories',
        select: 'name',
        options: { lean: true }
      });
      if (!book) {
        return null;
      }
      return book;
    } catch (err) {
      console.error(err);
      throw new Error('Error finding book by id');
    }
  }

  async findByAuthor(author) {
    try {
      const books = await Book.find({ author }).populate({
        path: 'categories',
        select: 'name',
        options: { lean: true }
      });
      return books;
    } catch (err) {
      console.error(err);
      throw new Error('Error finding books by author');
    }
  }

  async removeBook(id) {
    try {
      const book = await Book.findByIdAndDelete(id);
      if (!book) {
        return null;
      }
      for (const categoryId of book.categories) {
        await Category.findByIdAndUpdate(categoryId, { $pull: { books: book._id } });
      }
  
      return book;
    } catch (err) {
      console.error(err);
      throw new Error('Error deleting book');
    }
  }
  

  async addCategory(bookId, categoryId) {
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      book.categories.push(categoryId);
      await book.save();
      return book;
    } catch (err) {
      throw new Error('Error adding category to book');
    }
  }

  async removeCategory(bookId, categoryId) {
    try {
      const book = await Book.findById(bookId);
      if (!book) {
        throw new Error('Book not found');
      }
      book.categories.pull(categoryId);
      await book.save();
      return book;
    } catch (err) {
      throw new Error('Error removing category from book');
    }
  }
  async findByIdAndUpdate(id, newBook){
    try {
      const updateBook = await Book.findByIdAndUpdate(id, newBook, { new: true });
      for (const categoryId of newBook.categories) {
        
        const category = await Category.findByIdAndUpdate(categoryId, { $addToSet: { books: updateBook._id } }, { new: true });
    
        if (!category) {
            throw new Error(`Category with id ${categoryId} not found`);
        }
    }
      return updateBook;
    } catch (err) {
      console.error(err);
      throw new Error('Error updating book');
    }
  }


  async findByCategory(categoryId) {
    try {
        // Tìm danh mục với ID đã cho và populate các cuốn sách liên quan
        const category = await Category.findById(categoryId).populate({
          path: 'books',
          populate: {
              path: 'categories',
              select: 'name' // Chỉ lấy trường 'name' của các danh mục
          }
      });

        if (!category) {
            throw new Error(`Category with ID ${categoryId} not found`);
        }

        // Trả về danh sách các cuốn sách trong danh mục đã tìm thấy
        return category.books;
    } catch (error) {
        console.error(error);
        throw new Error('Error finding books by category');
    }
}


  }



export default BookRepository;
