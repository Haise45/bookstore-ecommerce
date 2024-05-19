import { Router } from "express";
import BookController from "../../../controllers/BookController.js";

const Admin = Router();
const bookController = new BookController();
Admin.get('/book/getAll', bookController.getBooks.bind(bookController));


export default Admin