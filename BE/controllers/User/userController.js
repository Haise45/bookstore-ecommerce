
import UserService from '../../services/User/UserService.js';

class UserController {
  constructor() {
    this._UserService = new UserService();
  }

  async getUsers(req, res) {
    try {
      const users = await this._UserService.getAllUsers();
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Successfully retrieved data",
        data: users,
      });
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }

  async getUserById(req, res) {
    try {
      const userId = req.params.id;
      const user = await this._UserService.findById(userId);
      if (!user) {
        return res.status(res.statusCode).json({
          status: res.statusCode,
          message: "user not found",
        });
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Successfully retrieved the user",
        data: user,
      });
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }

  async getUserByEmail(req, res) {
    try {
      const userId = req.params.id;
      const user = await this._UserService.findByEmail(userId);
      if (!user) {
        return res.status(res.statusCode).json({
          status: res.statusCode,
          message: "user not found",
        });
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "Successfully retrieved the user",
        data: user,
      });
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const updateduser = req.body; // Assuming request body contains the updated book data
      const user = await this._UserService.updateUser(userId, updateduser);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "user updated successfully",
        data: [{ user }]
      });
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }

  async removeUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await this._UserService.deleteUser(userId);
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: "user removed successfully",
        data: [{ user }]
      });
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.slice(7);
      }
      return res.status(res.statusCode).json({
        status: res.statusCode,
        message: errorMessage
      });
    }
  }
}

export default UserController