import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../../database/entities/user.entity';
import { HttpErrorResponseDto } from '../../common/dto/http-error-response.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleEnum } from '../../common/enums/role.enum';
import { UserPayloadDto } from '../../auth/dto/user-payload.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('jwt')
@Roles(RoleEnum.User)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOkResponse({ type: User })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiNotFoundResponse({
    description: 'User with ID ${id} not found',
    type: HttpErrorResponseDto,
  })
  async getCurrentUser(@CurrentUser() currentUser: UserPayloadDto) {
    const user = await this.userService.getUserById(currentUser.userId);

    if (user) {
      return user;
    }

    throw new NotFoundException(`User with ID ${currentUser.userId} not found`);
  }

  @Get(':id')
  @ApiOkResponse({ type: User })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiNotFoundResponse({
    description: 'User with ID ${id} not found',
    type: HttpErrorResponseDto,
  })
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User | null> {
    const user = await this.userService.getUserById(id);

    if (user) {
      return user;
    }

    throw new NotFoundException(`User with ID ${id} not found`);
  }
}
