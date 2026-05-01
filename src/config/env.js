require("dotenv").config();

const env = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "dev_secret_change_me",
  auth: {
    email: process.env.ADMIN_EMAIL || "admin@test.com",
    password: process.env.ADMIN_PASSWORD || "123456",
  },
};

module.exports = env;
