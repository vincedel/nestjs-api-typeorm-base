import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponseDto {
  @ApiProperty({ example: '401' })
  statusCode: string;

  @ApiProperty({ example: 'Unauthorized' })
  message: string;
}