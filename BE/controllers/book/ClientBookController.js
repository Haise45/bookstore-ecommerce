import ClientBookSerivce from "../../services/book/ClientBookService.js"; // Assuming clientBookService.js in the same directory
const clientBookService = new ClientBookSerivce();

class ClientBookController {
  constructor() {}

  async getBooks(req, res) {
    try {
      const books = await clientBookService.getAllBooks();
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
          message: errorMessage
      })
    }
  }

  async getBookById(req, res) {
    try {
      const bookId = req.params.id;
      const book = await clientBookService.getBookById(bookId);
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
          message: errorMessage
      })
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
    }
  }

  async searchBookByName(req,res){
    try{
      const name = req.params.keyword;
      const books  = await clientBookService.searchBookByName(name);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Successfully retrieved the book by name '" + name + "'",
        data: [books],
      });
    }catch(err){
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
          errorMessage = errorMessage.slice(7);
        }
      return res.status(res.statusCode).json({
          status: res.statusCode,
          message: errorMessage,
          data: null
      })
    }
  }

  async searchBookByCategory(req,res){
    try{
      const categoryId = req.params.id;
      const books  = await clientBookService.searchBookByCategory(categoryId);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Successfully retrieved the book by categoryID '" + categoryId + "'",
        data: [books],
      });
    }catch(err){
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
          errorMessage = errorMessage.slice(7);
        }
      return res.status(res.statusCode).json({
          status: res.statusCode,
          message: errorMessage,
          data: null
      })
    }

  }
}

export default ClientBookController;
