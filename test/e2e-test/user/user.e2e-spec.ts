import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { User } from '../../../src/database/entities/user.entity';
import { SortEnum } from '../../../src/database/enums/SortEnum.enum';
import { defaultUsers } from '../../mock-data/users.mock';
import { createTestingApp } from '../app.setup';
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

  describe('getUsers', () => {
    it('should throw an error to access to the endpoint /GET /users because we are not logged', () => {
      const queryOptions = {
        page: 1,
        limit: 10,
      };

      return request(app.getHttpServer())
        .get('/users')
        .query(queryOptions)
        .expect(401);
    });

    it('should return all users from the endpoint /GET /users', () => {
      const queryOptions = {
        page: 1,
        limit: -1,
      };

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .query(queryOptions)
        .then((res) => {
          expect(res.body.data.total).toBe(defaultUsers.length);
          expect(res.body.data.result?.length).toBe(defaultUsers.length);
        });
    });

    it('should return 2 users from the endpoint /GET /users', () => {
      const queryOptions = {
        page: 1,
        limit: 2,
      };

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .query(queryOptions)
        .then((res) => {
          expect(res.body.data.result?.length).toBe(2);
          expect(res.body.data.total).toBe(defaultUsers.length);
        });
    });

    it('should return 1 user in the seconde page from the endpoint /GET /users', () => {
      const queryOptions = {
        page: 2,
        limit: defaultUsers.length - 1,
      };

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .query(queryOptions)
        .then((res) => {
          expect(res.body.data.result?.length).toBe(1);
          expect(res.body.data.total).toBe(defaultUsers.length);
        });
    });

    it('should be sorted descending by username from the endpoint /GET /users', () => {
      const queryOptions = {
        page: 1,
        limit: -1,
        sort: {
          username: SortEnum.Desc,
        },
      };

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .query(queryOptions)
        .then((res) => {
          expect(res.body.data.result[0].username).toBe('user_ronaldo');
          expect(res.body.data.result[1].username).toBe('user_messi');
          expect(res.body.data.result[2].username).toBe('admin_james');
          expect(res.body.data.result[3].username).toBe('admin_curry');
        });
    });

    it('should be filtered by username like "Admin_%" and sorted by username descending from the endpoint /GET /users', () => {
      const queryOptions = {
        page: 1,
        limit: -1,
        filter: JSON.stringify([
          {
            username: {
              operator: 'ilike',
              value: 'Admin_%',
            },
          },
        ]),
        sort: {
          username: SortEnum.Desc,
        },
      };

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .query(queryOptions)
        .then((res) => {
          expect(res.body.data.result.length).toBe(2);
          expect(res.body.data.total).toBe(2);
          expect(res.body.data.result[0].username).toBe('admin_james');
          expect(res.body.data.result[1].username).toBe('admin_curry');
        });
    });
  });
});
