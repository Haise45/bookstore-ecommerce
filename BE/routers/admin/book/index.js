import { Router } from "express";
import AdminBookController from "../../../controllers/book/AdminBookController.js";

const adminBook = Router();
const adminBookController = new AdminBookController();

adminBook.get("/getAll", adminBookController.getBooks.bind(adminBookController));
adminBook.get("/:id", adminBookController.getBookById.bind(adminBookController));
adminBook.post("/add", adminBookController.addBook.bind(adminBookController));
adminBook.patch("/update/:id", adminBookController.updateBook.bind(adminBookController));
adminBook.delete("/delete/:id", adminBookController.removeBook.bind(adminBookController));


export default adminBook;