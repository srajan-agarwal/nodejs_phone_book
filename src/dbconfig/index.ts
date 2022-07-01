import { Sequelize } from "sequelize-typescript";
import { Information } from '../database/models/Information';
import * as pg from 'pg';

export const sequelize = new Sequelize(
  'contacts', //database
  'postgres', //username
  'rootbrijesh', //password
  {
    host: 'localhost',
    dialect: 'postgres',
    dialectModule: pg,
  });

sequelize.addModels([Information]);

export const initDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('DB Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export { Information };
