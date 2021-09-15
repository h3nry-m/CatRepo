const { Unauthorized, UnauthorizedError } = require("../utils/errors");

class User {
  static async login(credentials) {
    // submit user and pw

    // lookup user in db by email
    // if user is found, compare pw with pw in db
    // if there is a match, return the user
    // if anything wrong then return error
    throw new UnauthorizedError("Invalid email/password combo");
  }

  static async register(credentials) {
    // submit user info and if field missing throw an error
    // make sure no user already exists in the system with that email
    // take user pw and hash it
    // create a new user in the db with all the info
    // return their info
  }
}

module.exports = User;
