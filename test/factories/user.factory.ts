import { RoleEnum } from '../../src/common/enums/role.enum';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../src/database/entities/user.entity';
import { encodePassword } from '../../src/common/utils/bcrypt';

export const createUser = (overrides: Partial<User> = {}): User => {
  return {
    id: uuidv4(),
    role: RoleEnum.User,
    username: 'Default username',
    email: 'Default email',
    firstName: 'Default First Name',
    lastName: 'Default Last Name',
    password: encodePassword('Password123'),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
