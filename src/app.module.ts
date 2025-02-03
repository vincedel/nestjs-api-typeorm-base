import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './database/database-config';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
