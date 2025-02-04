import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const accessTokenDto = {
        access_token: 'access_token',
      };

      jest.spyOn(service, 'login').mockResolvedValue(accessTokenDto);

      await expect(
        controller.login({ username: 'username', password: 'password' }),
      ).resolves.toEqual(accessTokenDto);
    });

    it('should throw an error because the user does not exist', async () => {
      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.login({ username: 'username', password: 'password' }),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw an error because the password is wrong', async () => {
      jest
        .spyOn(service, 'login')
        .mockRejectedValue(new UnauthorizedException());

      await expect(
        controller.login({ username: 'username', password: 'password' }),
      ).rejects.toThrow('Unauthorized');
    });
  });
});
