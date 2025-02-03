import { ApiProperty } from '@nestjs/swagger';

export class ApiGenericResponse<T> {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  data: T;
}

export class ListResult<T> {
  total: number;
  result: T[];
}
