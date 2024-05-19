import User from "../../models/auth/user.js"

import UserServiceImp from './UserServiceImp.js'
const userService = new UserServiceImp();

class UserService {
    async findById(id) {
        const user = await userService.findById(id);
        return user;
    }

    async findByEmail(email) {
        const user = await userService.findByEmail(email);
        return user;
    }
    
    async getAllUsers() {
        const users = await userService.getAllUsers();
        return users;
    }
    async createUser(user) {
        return await userService.createUser(user);
    }
    async updateUser(id, userData) {
        return await userService.updateUser(id, userData);
    }
    async deleteUser(id) {
        await userService.deleteUser(id);
    }
}

export default UserService;