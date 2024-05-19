import BookRepository from "../../dao/BookRepository.js";
const bookRepository = new BookRepository();

class AdminBookServiceImp {
    async findById(id) {
      try {
        const book = await bookRepository.findById(id);
        return book;
      } catch (err) {
        console.error(err);
        throw new Error('Error finding book by ID');
      }
    }
  
    async updateBook(id, newBook) {
      try {
        const updatedBook = await bookRepository.findByIdAndUpdate(id, newBook, { new: true }); 
        return updatedBook;
      } catch (err) {
        console.error(err);
        throw new Error('Error updating book'); 
      }
    }
  
    async addBook(book) {
      try {
        const newBook = await bookRepository.create(book); 
        return newBook;
      } catch (err) {
        console.error(err);
        throw new Error('Error adding book'); 
      }
    }
  
    async removeBook(id) {
      try {
        await bookRepository.removeBook(id);
      } catch (err) {
        console.error(err);
        throw new Error('Error removing book'); 
      }
    }
  
    async searchBooks(keyword) {
      try {
        const books = await bookRepository.find({ name: { $regex: keyword, $options: 'i' } });
        return books;
      } catch (err) {
        console.error(err);
        throw new Error('Error searching books');
      }
    }
  
    async getAllBooks() {
      try {
        const books = await bookRepository.findAll();
        return books;
      } catch (err) {
        console.error(err);
        throw new Error('Error getting all books'); 
      }
    }
  }
  
  export default AdminBookServiceImp;
  