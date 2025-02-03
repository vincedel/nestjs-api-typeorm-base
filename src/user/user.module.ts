import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isUniqueConstraint } from '../common/decorators/constraints/unique-entity.constraint';
import { User } from '../database/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, isUniqueConstraint],
  exports: [UserService],
})
export class UserModule {}
