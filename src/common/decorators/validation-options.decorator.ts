import { SetMetadata, ValidationPipeOptions } from '@nestjs/common';

export const ValidationOptions = (options: Partial<ValidationPipeOptions>) =>
  SetMetadata('validation:options', options);
