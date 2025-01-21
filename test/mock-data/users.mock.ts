import { createUser } from '../factories/user.factory';
import { RoleEnum } from '../../src/common/enums/role.enum';
import { User } from '../../src/database/entities/user.entity';

export const defaultUsers: User[] = [
  createUser({
    id: '377ccef6-c7b7-46e2-994e-b8a396d3353c',
    username: 'admin_james',
    email: 'admin_james@clubber.com',
    firstName: 'Lebron',
    lastName: 'James',
    role: RoleEnum.Admin,
  }),
  createUser({
    id: '1262cc96-f314-4727-94df-504b6ac256fd',
    username: 'admin_curry',
    email: 'admin_curry@clubber.com',
    firstName: 'Stephen',
    lastName: 'Curry',
    role: RoleEnum.Admin,
  }),
  createUser({
    id: '6602b98e-f8d8-4a26-ab7a-f75e5a5a9fc8',
    username: 'user_messi',
    email: 'user_messi@clubber.com',
    firstName: 'Lionel',
    lastName: 'Messi',
    role: RoleEnum.User,
  }),
  createUser({
    id: '0b6aa226-a7ca-4e1c-a315-a9187d32f4c2',
    username: 'user_ronaldo',
    email: 'user_ronaldo@clubber.com',
    firstName: 'Christiano',
    lastName: 'Ronaldo',
    role: RoleEnum.User,
  }),
];

export const UserProvider = {
  getUserById: jest
    .fn()
    .mockImplementation((id: string) =>
      defaultUsers.find((user) => user.id === id),
    ),
  getUsersByUsernameOrEmail: jest
    .fn()
    .mockImplementation((emailOrUsername: string) =>
      Promise.resolve(() => {
        return defaultUsers.find(
          (user) =>
            user.username === emailOrUsername || user.email === emailOrUsername,
        );
      }),
    ),
};
