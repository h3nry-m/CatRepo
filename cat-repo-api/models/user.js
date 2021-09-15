const bcrypt = require("bcrypt");
const { UnauthorizedError, BadRequestError } = require("../utils/errors");
const db = require("../db");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  static async makePublicUser(user) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
    };
  }

  static async login(credentials) {
    const requiredFields = ["email", "password"];
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body.`);
      }
    });

    const user = await User.fetchUserByEmail(credentials.email);

    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      // will compare the submitted pw with the hashed pw in the db
      if (isValid) {
        return User.makePublicUser(user);
      }
    }
    // if any of this goes wrong, throw an error
    throw new UnauthorizedError("Invalid email/pw combo");
  }

  static async register(credentials) {
    const requiredFields = [
      "email",
      "password",
      "username",
      "first_name",
      "last_name",
    ];
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body`);
      }
    });

    const existingUser = await User.fetchUserByEmail(credentials.email);
    if (existingUser) {
      throw new BadRequestError(`Duplicate email: ${credentials.email}`);
    }

    // take the user pw and hash it
    const hashedPW = await bcrypt.hash(
      credentials.password,
      BCRYPT_WORK_FACTOR
    );

    const lowercasedEmail = credentials.email.toLowerCase();
    const result = await db.query(
      `
        INSERT INTO users (
            email, 
            password,
            username,
            first_name,
            last_name
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, email, password, username, first_name, last_name;
    `,
      [
        lowercasedEmail,
        hashedPW,
        credentials.username,
        credentials.first_name,
        credentials.last_name,
      ]
    );
    const user = result.rows[0];
    return User.makePublicUser(user);
  }

  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided");
    }

    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await db.query(query, [email.toLowerCase()]);
    const user = result.rows[0];
    return user;
  }
}

module.exports = User;
