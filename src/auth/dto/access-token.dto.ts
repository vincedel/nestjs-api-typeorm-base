import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ApiGenericResponse } from '../../common/dto/api-response.dto';

export class AccessTokenDto {
  @IsString()
  @ApiProperty()
  readonly access_token: string;
}

export class ApiAccessTokenDto extends ApiGenericResponse<AccessTokenDto> {
  @ApiProperty({ type: () => AccessTokenDto })
  data: AccessTokenDto;
}
