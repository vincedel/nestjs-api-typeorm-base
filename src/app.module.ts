import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database/database-config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
