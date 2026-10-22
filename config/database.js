const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "epps_license",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "S3nyumpag1h4ri",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "postgres",
    logging: process.env.NODE_ENV === "production" ? false : console.log,
  }
);

try {
  sequelize.authenticate();
  sequelize.sync(
    {
      alter: true
    }
  );
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
module.exports = sequelize;
