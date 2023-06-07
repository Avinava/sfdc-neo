import * as dotenv from "dotenv";
const UNAUTHENTICATED_ENDPOINTS = ["/api/auth/"];

dotenv.config();

class Authentication {
  constructor() {
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
    if (
      this.isAuthenticatedEndpoint(req.path) &&
      !req.session?.passport?.user
    ) {
      return res.status(401).send({
        message: "You are not logged in.",
      });
    } else {
      next();
    }
  }

  isAuthenticatedEndpoint(path) {
    let isAuthenticated = false;
    UNAUTHENTICATED_ENDPOINTS.forEach((endpoint) => {
      if (path.startsWith(endpoint)) {
        isAuthenticated = true;
      }
    });
    return isAuthenticated;
  }
}

export default new Authentication();
