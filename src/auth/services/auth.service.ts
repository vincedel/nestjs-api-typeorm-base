import {
  Injectable,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../database/entities/user.entity';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AccessTokenDto } from '../dto/access-token.dto';
import { comparePasswords } from '../../common/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async login(credentials: AuthenticationDto): Promise<AccessTokenDto> {
    const user: User | null = await this.userService.getUsersByUsernameOrEmail(
      credentials.username,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.password) {
      if (comparePasswords(credentials.password, user.password)) {
        const payload = {
          sub: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        };

        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
    }

    throw new UnauthorizedException();
  }
}
