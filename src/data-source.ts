import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database:
    process.env.NODE_ENV === 'test'
      ? configService.get('DB_DATABASE_TEST')
      : configService.get('DB_DATABASE'),
  synchronize: process.env.NODE_ENV === 'test',
};

const jestCLIOptions = {
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
};

const dataSource = new DataSource({ ...dataSourceOptions, ...jestCLIOptions });
export default dataSource;
