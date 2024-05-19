import UserRepository from "../../dao/UserRepository.js";
const userRepository = new UserRepository();

class UserServiceImp {
    async findById(id) {
        try {
            const user = await userRepository.findById(id);
            return user;
        } catch (err) {
            console.error(err);
            throw new Error('Error finding user by ID');
        }
    }

    async findByEmail(email) {
        try {
            const user = await userRepository.findByEmail(email);
            return user;
        } catch (err) {
            console.error(err);
            throw new Error('Error finding user by Email');
        }
    }

    async updateUser(id, userData) {
        try {
            const updatedUser = await userRepository.update(id, userData);
            return updatedUser;
        } catch (err) {
            console.error(err);
            throw new Error('Error updating user');
        }
    }

    async createUser(user) {
        try {
            const newUser = await userRepository.create(user);
            return newUser;
        } catch (err) {
            console.error(err);
            throw new Error('Error creating user');
        }
    }

    async deleteUser(id) {
        try {
            await userRepository.delete(id);
        } catch (err) {
            console.error(err);
            throw new Error('Error deleting user');
        }
    }

    async searchUsers(keyword) {
        try {
            const users = await userRepository.find({ $or: [{ firstName: { $regex: keyword, $options: 'i' } }, { lastName: { $regex: keyword, $options: 'i' } }] });
            return users;
        } catch (err) {
            console.error(err);
            throw new Error('Error searching users');
        }
    }

    async getAllUsers() {
        try {
            const users = await userRepository.findAll();
            return users;
        } catch (err) {
            console.error(err);
            throw new Error('Error getting all users');
        }
    }
}

export default UserServiceImp;