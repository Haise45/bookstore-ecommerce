import AdminBookServiceImp from "../../services/book/AdminBookServiceImp.js";
const adminBookServiceImp = new AdminBookServiceImp();

class AdminBookService {
    async findById(id){
        const book = await adminBookServiceImp.findById(id);
        return book;
    }
    async getAllBooks(){
        const books = await adminBookServiceImp.getAllBooks();
        return books;
    }
    async addBook(book){
        await adminBookServiceImp.addBook(book);
    }
    async updateBook(id, newBook){
        await adminBookServiceImp.updateBook(id, newBook);
    }
    async removeBook(id){
        await adminBookServiceImp.removeBook(id);
    }
  }
  
  export default AdminBookService;
  