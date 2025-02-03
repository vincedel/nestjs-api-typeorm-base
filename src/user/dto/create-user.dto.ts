import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { MatchField } from '../../common/decorators/constraints/match-field.constraint';
import { isUnique } from '../../common/decorators/constraints/unique-entity.constraint';
import { Trim } from '../../common/decorators/trim.decorator';
import { ValidationOptions } from '../../common/decorators/validation-options.decorator';
import { RoleEnum } from '../../common/enums/role.enum';

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
