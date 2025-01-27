import { Module } from '@nestjs/common';
import { isUniqueConstraint } from './decorators/constraints/unique-entity.constraint';

@Module({
  imports: [],
  controllers: [],
  providers: [isUniqueConstraint],
  exports: [isUniqueConstraint],
})
export class CommonModule {}
