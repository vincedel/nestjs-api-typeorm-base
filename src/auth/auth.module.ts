import { Module } from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { RolesGuard } from './gards/roles.guard';
import { JwtAuthGuard } from './gards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '120m' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
    { provide: 'APP_GUARD', useClass: RolesGuard },
    JwtStrategy,
  ],
})
export class AuthModule {}
