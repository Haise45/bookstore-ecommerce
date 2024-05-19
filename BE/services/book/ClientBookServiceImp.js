import BookRepository from "../../dao/BookRepository.js";
const bookRepository = new BookRepository();

class ClientBookSerivceImp {
    async getAllBooks() {
        try {
          const books = await bookRepository.findAll();
          return books;
        } catch (err) {
          console.error(err);
          throw new Error('Error getting all books'); 
        }
    }
    async findById(id) {
        try {
          const book = await bookRepository.findById(id);
          return book;
        } catch (err) {
          console.error(err);
          throw new Error('Error finding book by ID');
        }
      }

      async searchBookByName(name) {
        try {
          const books = await bookRepository.findAll();
          const filteredBooks = books.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
          );
          if(filteredBooks.length === 0 ){
            
            throw new Error("no book found for name ")
          }
          return filteredBooks;
        } catch (err) {
          console.error(err);
          throw new Error('Error searching for books by name');
        }
      }

      async searchBookByCategory(categoryId) {
        try {
          const books = await bookRepository.findByCategory(categoryId);
          return books;
        } catch (err) {
          console.error(err);
          throw new Error('Error searching for books by category');
        }
      }

}
export default ClientBookSerivceImp;