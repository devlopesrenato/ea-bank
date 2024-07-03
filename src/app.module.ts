import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { PaymentModule } from './payment/payment.module';
import { ReportModule } from './report/report.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MulterModule } from '@nestjs/platform-express';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.getOrThrow('UPLOAD_RATE_TTL'),
        limit: configService.getOrThrow('UPLOAD_RATE_LIMIT'),
        dest: configService.get<string>('MULTER_DEST'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot(),
    PrismaModule,
    AccountModule,
    PaymentModule,
    ReportModule,
    AuthModule,
    UserModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
