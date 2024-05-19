
import jwt from 'jsonwebtoken'
import AuthService from '../../services/Auth/AuthenticationService.js'
import TokenRegistration from '../../models/auth/tokenregistration.js';

import UserService from '../../services/User/UserService.js';
const userService = new UserService();
const authService = new AuthService();
export async function signup(req, res, next) {
    try {
        const { error, savedUser ,confirmationUrl} = await authService.register(req);

        if (error) {
            throw error; // Chuyển lỗi cho middleware xử lý lỗi
        }
        
        

        res.json({
            status: 201,
            message: "Successfully register ",
            data: {
                email: savedUser.email,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                role: savedUser.role
            }
        });
    } catch (error) {
        next(error); // Xử lý lỗi trong middleware xử lý lỗi
    }
}

export async function signin(req, res, next) {
    try {
        const { email, password } = req.body;
        const { error, user } = await authService.authenticate(email, password);

        if (error) {
            throw error; // Chuyển lỗi cho middleware xử lý lỗi
        }

        const key = process.env.JWT_SECRETKEY;
        const token = jwt.sign({ email, role: user.role }, key, {
            expiresIn: process.env.JWT_EXPIRATION,
        });

        req.session.user = {

            id: user._id,
            email: user.email,
        }

        res.json({
            status: 200,
            message: "Successfully login ",
            token: token,
            data: [{
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                id: user.id
            }]
        });
    } catch (error) {
        next(error); // Xử lý lỗi trong middleware xử lý lỗi
    }
}

export const authenticateJWT = async (req, res, next) => {
    try {
        authService.authenticateJWT(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        authService.isAdmin(req, res, next);
    } catch (error) {
        next(error);
    }
};

export async function confirmRegistration(req,res,next) {
    const { token } = req.params;
    // Tìm token trong collection TokenRegistration
    const tokenRegistration = await TokenRegistration.findOne({ token })
      
    
    if (!tokenRegistration) {
      return res.status(400).send('Invalid Token');
    }
  
    // Kiểm tra token đã hết hạn hay chưa
    if (tokenRegistration.expiresAt < Date.now()) {
      await TokenRegistration.deleteOne({ token });
      return res.status(400).send('Token has expired');
    }
  
    // Kích hoạt tài khoản người dùng
    const user = await userService.findByEmail(tokenRegistration.userEmail);
    console.log(tokenRegistration.userEmail);
    
    user.isEnable = true;
    await user.save();
  
    // Xóa token khỏi collection TokenRegistration
    await TokenRegistration.deleteOne({ token });
  
    res.json({
        status: 200,
        message: "Account activation successful",
        data: [{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        }]
    });
  };

