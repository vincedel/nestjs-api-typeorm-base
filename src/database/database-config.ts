import * as dotenv from 'dotenv';
dotenv.config();
import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  dropSchema: false,
  logging: true,
  logger: 'file',
  entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '**', '*{.ts,.js}')],
  subscribers: [join(__dirname, 'subscribers', '**', '*{.ts,.js}')],
};
