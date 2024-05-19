import ClientBookSerivceImp from "../../services/book/ClientBookServiceImp.js";
const clientBookServiceImp = new ClientBookSerivceImp();

class ClientBookSerivce {
    async getAllBooks() {
        const books = await clientBookServiceImp.getAllBooks();
        return books;
    }
    async getBookById(id) {
        const book = await clientBookServiceImp.findById(id);
        return book;
    }

    async searchBookByName(name){
        const books = await clientBookServiceImp.searchBookByName(name);
        return books;
    }

    async searchBookByCategory(categoryId){
        const books = await clientBookServiceImp.searchBookByCategory(categoryId);
        return books;
    }
}
export default ClientBookSerivce;