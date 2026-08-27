import * as dotenv from "dotenv";
import knex from "knex";

dotenv.config();


const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: { rejectUnauthorized: false }
  },
});

export default db;
