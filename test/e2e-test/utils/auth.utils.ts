import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function loginAsTestAdminUser(
  app: INestApplication,
): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/login')
    .send({ username: 'admin_james', password: 'Password123' })
    .expect(201);

  return response.body.data.access_token;
}

export async function loginAsTestUser(app: INestApplication): Promise<string> {
  const response = await request(app.getHttpServer())
    .post('/login')
    .send({ username: 'user_messi', password: 'Password123' })
    .expect(201);

  return response.body.data.access_token;
}
