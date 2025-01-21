import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthenticationDto } from '../dto/authentication.dto';
import { AccessTokenDto, ApiAccessTokenDto } from '../dto/access-token.dto';
import { UnauthorizedResponseDto } from '../dto/unauthorized-response.dto';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @ApiResponse({
    status: 200,
    type: ApiAccessTokenDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseDto,
  })
  async login(@Body() credentials: AuthenticationDto): Promise<AccessTokenDto> {
    return this.authService.login(credentials);
  }
}
