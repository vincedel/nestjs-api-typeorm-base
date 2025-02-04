import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { defaultUsers, UserProvider } from '../../../test/mock-data/users.mock';
import { UserPayloadDto } from '../../auth/dto/user-payload.dto';
import { RoleEnum } from '../../common/enums/role.enum';
import { FilterQueryOptionsDto } from '../../database/dto/filter-query-options.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: UserProvider,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      const currentUser: UserPayloadDto = {
        userId: '377ccef6-c7b7-46e2-994e-b8a396d3353c',
        username: 'admin james',
        email: 'admin_james@clubber.com',
        role: RoleEnum.Admin,
      };

      await expect(controller.getCurrentUser(currentUser)).resolves.toEqual(
        defaultUsers[0],
      );
    });

    it("should return an error because the user doesn't exist", async () => {
      const currentUser: UserPayloadDto = {
        userId: '165',
        username: 'admin james',
        email: 'admin_james@clubber.com',
        role: RoleEnum.Admin,
      };

      await expect(controller.getCurrentUser(currentUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUserById', () => {
    it('should return an user', async () => {
      await expect(
        controller.getUserById('377ccef6-c7b7-46e2-994e-b8a396d3353c'),
      ).resolves.toEqual(defaultUsers[0]);
    });

    it("should return an error because the user doesn't exist", async () => {
      await expect(controller.getUserById('161')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUsers', () => {
    it('should return a list of users', async () => {
      jest.spyOn(service, 'getUsers').mockResolvedValue({
        total: defaultUsers.length,
        result: defaultUsers,
      });

      await expect(
        controller.getUsers(new FilterQueryOptionsDto()),
      ).resolves.toEqual({
        total: defaultUsers.length,
        result: defaultUsers,
      });
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest
        .spyOn(service, 'create')
        .mockResolvedValue(defaultUsers[defaultUsers.length - 1]);

      await expect(controller.create(new CreateUserDto())).resolves.toEqual(
        defaultUsers[defaultUsers.length - 1],
      );
    });
  });
});
