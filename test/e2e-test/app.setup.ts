import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { configApp } from '../../src/config/main-config';

export async function createTestingApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  let app = moduleFixture.createNestApplication();

  app = configApp(app);

  await app.init();

  const dataSource = app.get<DataSource>(DataSource);

  await dataSource.runMigrations();
  return app;
}
