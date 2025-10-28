import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false,
});
