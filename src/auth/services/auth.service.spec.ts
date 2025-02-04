import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { defaultUsers } from '../../../test/mock-data/users.mock';
import * as bcryptUtils from '../../common/utils/bcrypt';
import { UserService } from '../../user/services/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService;
  let userService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verify: jest.fn(),
            decode: jest.fn(),
            sign: jest.fn(),
            verifyAsync: jest.fn(),
            decodeAsync: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUsersByUsernameOrEmail: jest
              .fn()
              .mockResolvedValue(defaultUsers[0]),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(AuthService).toBeDefined();
  });

  it('should be defined', () => {
    expect(JwtService).toBeDefined();
  });

  it('should be defined', () => {
    expect(UserService).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const accessTokenDto = {
        access_token: 'access_token',
      };

      jest
        .spyOn(userService, 'getUsersByUsernameOrEmail')
        .mockResolvedValue(defaultUsers[0]);

      jest.spyOn(bcryptUtils, 'comparePasswords').mockReturnValue(true);

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('access_token');

      const result = await authService.login({
        username: 'admin_james',
        password: 'password',
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: defaultUsers[0].id,
        username: defaultUsers[0].username,
        email: defaultUsers[0].email,
        role: defaultUsers[0].role,
      });

      expect(result).toStrictEqual(accessTokenDto);
    });

    it('should throw an error because the user does not exist', async () => {
      jest
        .spyOn(userService, 'getUsersByUsernameOrEmail')
        .mockResolvedValue(null);

      await expect(
        authService.login({
          username: 'username',
          password: 'password',
        }),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw an error because the password is wrong', async () => {
      jest.spyOn(bcryptUtils, 'comparePasswords').mockReturnValue(false);

      await expect(
        authService.login({
          username: 'username',
          password: 'password',
        }),
      ).rejects.toThrow('Unauthorized');
    });
  });
});
