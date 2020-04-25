// Update with your config settings.

module.exports = {

  development: {
    client: "pg",
    connection: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@localhost/FoodTruck`,
    useNullAsDefault: true,

    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
  testing: {
    client: "pg",
    connection: {
      filename: "./data/test.db3",
    },
    useNullAsDefault: true,
    migrations: {
    directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
  production: {
    client: 'pg', 
    connection: process.env.DATABASE_URL, 
    migrations: {
       directory: './data/migrations',
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
};
