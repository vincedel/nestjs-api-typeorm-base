import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { isUniqueConstraint } from 'src/common/decorators/constraints/unique-entity.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, isUniqueConstraint],
  exports: [UserService],
})
export class UserModule {}
