import { Router } from "express";
import UserController  from "../../../controllers/User/userController.js";
import UserService from "../../../services/User/UserService.js";


const user = Router();
const userController = new UserController()
user.get('/getAll',userController.getUsers.bind(userController));
user.get('/findbyid/:id', userController.getUserById.bind(userController));
user.get('/findbyemail/:email', userController.getUserByEmail.bind(userController));
user.post('/delete/:id',userController.removeUser.bind(userController));
user.patch('/update/:id',userController.updateUser.bind(userController));
export default user;