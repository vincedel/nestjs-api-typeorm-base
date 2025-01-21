import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createTestingApp } from '../app.setup';
import { defaultUsers } from '../../mock-data/users.mock';
import { User } from '../../../src/database/entities/user.entity';
import { loginAsTestAdminUser, loginAsTestUser } from '../utils/auth.utils';

jest.setTimeout(30000);

describe('User (e2e)', () => {
  let app: INestApplication;
  let adminAccessToken: string;
  let userAccessToken: string;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    app = await createTestingApp();

    userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    await userRepository.save(defaultUsers);

    adminAccessToken = await loginAsTestAdminUser(app);
    userAccessToken = await loginAsTestUser(app);
  });

  afterAll(async () => {
    await userRepository.clear();
    await app.close();
  });

  describe('getCurrentUser (e2e)', () => {
    it('should have access to the endpoint /GET /users/me as Admin', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.data).toHaveProperty('username');
          expect(res.body.data.username).toBe('admin_james');
        });
    });

    it('should have access to the endpoint /GET /users/me as User', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.data).toHaveProperty('username');
          expect(res.body.data.username).toBe('user_messi');
        });
    });
  });

  describe('getUserById (e2e)', () => {
    it('should have access to the endpoint /GET /users/:id as Admin', () => {
      const id: string = defaultUsers[1].id;

      return request(app.getHttpServer())
        .get('/users/' + id)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.data).toHaveProperty('username');
          expect(res.body.data.username).toBe('admin_curry');
        });
    });

    it('should have access to the endpoint /GET /users/:id as User', () => {
      const id: string = defaultUsers[1].id;

      return request(app.getHttpServer())
        .get('/users/' + id)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.data).toHaveProperty('username');
          expect(res.body.data.username).toBe('admin_curry');
        });
    });

    it('should throw an error to access to the endpoint /GET /users/:id as User because the ID is not an UUID', () => {
      return request(app.getHttpServer())
        .get('/users/' + 12)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(400)
        .then((res) => {
          expect(res.body.status).toBe(false);
          expect(res.body.message).toBe('Validation failed (uuid is expected)');
        });
    });

    it('should throw a not found exception to access to the endpoint /GET /users/:id as User because the ID is not found in database', () => {
      const notFoundUUID: string = '10545872-7061-47a1-849d-d00e3b4df666';

      return request(app.getHttpServer())
        .get('/users/' + notFoundUUID)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(404)
        .then((res) => {
          expect(res.body.status).toBe(false);
          expect(res.body.message).toBe(
            'User with ID 10545872-7061-47a1-849d-d00e3b4df666 not found',
          );
        });
    });
  });
});
