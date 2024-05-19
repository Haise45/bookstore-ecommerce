import {Router} from 'express'
import {confirmRegistration, signin,signup} from '../../../controllers/Auth/AuthController.js';

const auth = new Router();

auth.post('/register',signup)
auth.post('/authenticate',signin)
auth.get('/confirm-registration/:token',confirmRegistration)
export default auth
