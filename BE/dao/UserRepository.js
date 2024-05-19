import User from '../models/auth/user.js';

class UserRepository {
  constructor() {
  }

  async findAll() {
    const users = await User.find();
    return users;
  }

  async findById(id) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Error finding user by ID');
    }
  }

  async findByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Error finding user by email');
    }
  }

  async create(userData) {
    try {
      const user = await User.create(userData);
      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Error creating user');
    }
  }

  async update(id, userData) {
    try {
      const user = await User.findByIdAndUpdate(id, userData, { new: true });
      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Error updating user');
    }
  }

  async delete(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Error deleting user');
    }
  }

  async getUserRole(id){
    try {
      const user = await User.findById(id);
      return user.role;
    } catch (err) {
      console.error(err);
      throw new Error('Error getting user role');
    }
  }
}

export default UserRepository;