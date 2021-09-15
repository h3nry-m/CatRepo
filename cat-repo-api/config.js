require("dotenv").config();
require("colors");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
// const SECRET_KEY = process.env.SECRET_KEY || "secret_dev"

function getDatabaseUri() {
  const dbUser = process.env.DATABASE_USER || "postgres";
  const dbPass = process.env.DATABASE_PASS
    ? encodeURI(process.env.DATABASE_PASS)
    : "postgres"; //if that pw exists in the DB then we'll encode it, if not default to postgres
  const dbHost = process.env.DATABASE_HOST || "localhost";
  const dbPort = process.env.DATABASE_PORT || 5432;
  const dbName = process.env.DATABASE_NAME || "cat_repo";

  // if DB_URL environment variable, use that
  // otherwise create the DB connection string ourselves
  return (
    process.env.DATABASE_URL ||
    `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
  );
}

// means it'll hash it by 2^13
const BCRYPT_WORK_FACTOR = 13;

console.log("Cat Repo:".red);
console.log("PORT:".blue, PORT);
// console.log("SECRET_KEY:".blue, SECRET_KEY)
console.log("Database URI:".blue, getDatabaseUri());
console.log("----");

module.exports = {
  PORT,
  // SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};

// will make these things available to the rest of the application
