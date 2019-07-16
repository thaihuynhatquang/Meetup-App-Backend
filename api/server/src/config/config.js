require("dotenv").config();

module.exports = {
  // If using onine database
  // development: {
  //   use_env_variable: 'DATABASE_URL'
  // },

  development: {
    username: "root",
    password: null,
    database: "meetup",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false
  },

  test: {
    username: "root",
    password: null,
    database: "meetup_test",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false
  },

  production: {
    username: "root",
    password: null,
    database: "meetup_production",
    host: "127.0.0.1",
    dialect: "mysql",
    operatorsAliases: false
  }
};
