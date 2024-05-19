import AuthenticationServiceImp from './AuthenticationServiceImp.js';


class AuthenticationService {git 
  constructor() {
    this.authServiceImp = new AuthenticationServiceImp();
  }

  async register(req) {
    return await this.authServiceImp.register(req);
  }

  async authenticate(email, password) {
    return await this.authServiceImp.authenticate(email, password);
  }

  authenticateJWT(req, res, next) {
    this.authServiceImp.authenticateJWT(req, res, next);
  }

  isAdmin(req, res, next) {
    this.authServiceImp.isAdmin(req, res, next);
  }

  async confirmRegistration(req, res) {
    return await this.authServiceImp.confirmRegistration(req, res);
  }
}

export default AuthenticationService;