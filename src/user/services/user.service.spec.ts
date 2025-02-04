import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource, Repository } from 'typeorm';
import { defaultUsers } from '../../../test/mock-data/users.mock';
import { getRepositoryMock } from '../../../test/utils/repository.mock';
import { RoleEnum } from '../../common/enums/role.enum';
import * as bcryptUtils from '../../common/utils/bcrypt';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let dataSource: DataSource;
  const userRepositoryToken = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: userRepositoryToken,
          useValue: getRepositoryMock<User>(defaultUsers),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('getUserById', () => {
    it('should return an user', async () => {
      await userService.getUserById('1262cc96-f314-4727-94df-504b6ac256fd');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        id: '1262cc96-f314-4727-94df-504b6ac256fd',
      });
      expect(userRepository.findOneBy).toHaveReturnedWith(defaultUsers[1]);
    });

    it("should not return an user because it doesn't exist", async () => {
      await userService.getUserById('1262cc96-f314-4727-94df-504b6ac256aa');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        id: '1262cc96-f314-4727-94df-504b6ac256aa',
      });
      expect(userRepository.findOneBy).toHaveReturnedWith(null);
    });
  });

  describe('getUsers', () => {
    it('should return a list a users', async () => {
      const queryOptions = {
        page: 1,
        limit: 20,
      };

      const findOptions = {
        skip: 0,
        take: 20,
      };

      jest
        .spyOn(userService, 'getFindOptionsByQueryOptions')
        .mockReturnValue(findOptions);

      jest
        .spyOn(userRepository, 'findAndCount')
        .mockResolvedValue([defaultUsers, defaultUsers.length]);

      const result = await userService.getUsers(queryOptions);

      expect(userService.getFindOptionsByQueryOptions).toHaveBeenCalledWith(
        queryOptions,
        User,
      );
      expect(userRepository.findAndCount).toHaveBeenCalledWith(findOptions);
      expect(result).toStrictEqual({
        total: defaultUsers.length,
        result: defaultUsers,
      });
    });
  });

  describe('getUsersByUsernameOrEmail', () => {
    it('should return an user based on the email', async () => {
      await userService.getUsersByUsernameOrEmail('admin_james@clubber.com');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [
          {
            username: 'admin_james@clubber.com',
          },
          {
            email: 'admin_james@clubber.com',
          },
        ],
      });
      expect(userRepository.findOne).toHaveReturnedWith(defaultUsers[0]);
    });

    it('should return an user based on the username', async () => {
      await userService.getUsersByUsernameOrEmail('admin_james');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [
          {
            username: 'admin_james',
          },
          {
            email: 'admin_james',
          },
        ],
      });
      expect(userRepository.findOne).toHaveReturnedWith(defaultUsers[0]);
    });

    it("should not return an user based on the username because it doesn't exist", async () => {
      await userService.getUsersByUsernameOrEmail('username_not_exist');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [
          {
            username: 'username_not_exist',
          },
          {
            email: 'username_not_exist',
          },
        ],
      });
      expect(userRepository.findOne).toHaveReturnedWith(null);
    });

    it("should not return an user based on the email because it doesn't exist", async () => {
      await userService.getUsersByUsernameOrEmail(
        'username_not_exist@clubber.com',
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [
          {
            username: 'username_not_exist@clubber.com',
          },
          {
            email: 'username_not_exist@clubber.com',
          },
        ],
      });
      expect(userRepository.findOne).toHaveReturnedWith(null);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userDto: CreateUserDto = {
        username: 'test',
        email: 'test@clubber.com',
        firstName: 'test',
        lastName: 'test',
        password: 'password',
        passwordConfirm: 'password',
        role: RoleEnum.Admin,
      };

      const { passwordConfirm, ...resultRepositoryCreate } = userDto;

      const resultCreateMethod = {
        ...resultRepositoryCreate,
        password: 'PasswordEncoded',
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(bcryptUtils, 'encodePassword')
        .mockReturnValue('PasswordEncoded');

      jest.spyOn(userRepository, 'create').mockReturnValue(resultCreateMethod);
      jest.spyOn(userRepository, 'save').mockResolvedValue(resultCreateMethod);

      const result = await userService.create(userDto);

      expect(bcryptUtils.encodePassword).toHaveBeenCalledWith('password');
      expect(userRepository.create).toHaveBeenCalledWith({
        ...resultRepositoryCreate,
        password: 'PasswordEncoded',
      });
      expect(result).toStrictEqual(resultCreateMethod);
    });
  });
});
