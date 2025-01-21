import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthenticationDto {
  @IsString()
  @ApiProperty({ example: 'example@gmail.com' })
  readonly username: string;

  @IsString()
  @ApiProperty({ example: 'Password123' })
  readonly password: string;
}
