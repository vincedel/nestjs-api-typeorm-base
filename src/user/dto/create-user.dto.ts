import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { RoleEnum } from '../../common/enums/role.enum';
import { ValidationOptions } from '../../common/decorators/validation-options.decorator';
import { MatchField } from 'src/common/decorators/constraints/match-field.constraint';
import { Trim } from 'src/common/decorators/trim.decorator';
import { isUnique } from 'src/common/decorators/constraints/unique-entity.constraint';

@ValidationOptions({ whitelist: true })
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Trim()
  @isUnique({ tableName: 'users', column: 'username' })
  username: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  @Trim()
  @isUnique({ tableName: 'users', column: 'email' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @Trim()
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  @Trim()
  lastName: string;

  @IsString()
  @ApiProperty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 1,
  })
  password: string;

  @ApiProperty()
  @Expose({ name: 'passwordConfirm' })
  @MatchField('password')
  passwordConfirm: string;

  @ApiProperty({
    enum: RoleEnum,
    enumName: 'RoleEnum',
    default: Object.values(RoleEnum).join(' | '),
  })
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
