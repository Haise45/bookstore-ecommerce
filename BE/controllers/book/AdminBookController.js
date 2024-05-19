import AdminBookService from "../../services/book/AdminBookService.js"; // Assuming AdminBookService.js in the same directory
const adminBookService = new AdminBookService();

class AdminBookController {
  constructor() {}

  async getBooks(req, res) {
    try {
      const books = await adminBookService.getAllBooks();
      const response = books.map(book => this.responseBook(book));
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

  async getBookById(req, res) {
    try {
      const bookId = req.params.id;
      const book = await adminBookService.findById(bookId);
      if (!book) {
        return res.status(res.statusCode).json({
          status: res.statusCode,
          message: "Book not found",
        });
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Successfully retrieved the book",
        data: this.responseBook(book),
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

  async addBook(req, res) {
    try {
      const newBook = req.body; 
      await adminBookService.addBook(newBook);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Book added successfully",
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

  async updateBook(req, res) {
    try {
      const bookId = req.params.id;
      const updatedBook = req.body; 
      await adminBookService.updateBook(bookId, updatedBook);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Book updated successfully",
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

  async removeBook(req, res) {
    try {
      const bookId = req.params.id;
      await adminBookService.removeBook(bookId);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Book removed successfully",
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

  responseBook(book){
    return {
      _id: book._id,
      price: book.price,
      image: book.image,
      name: book.name,
      author: book.author,
      description: book.description,
      categories: book.categories
    };
  }
}

export default AdminBookController;
