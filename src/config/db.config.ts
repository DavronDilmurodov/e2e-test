import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  username: 'postgres',
  database: 'todo_nest',
  password: 'luntik553',
  logging: false,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected successfully');
  } catch (error) {
    console.log('DB: ' + error.message);
  }
})();
