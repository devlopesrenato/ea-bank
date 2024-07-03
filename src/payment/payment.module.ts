import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentRepository } from './payment.repository';
import { AccountRepository } from 'src/account/account.repository';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PrismaService,
    PaymentRepository,
    AccountRepository,
    UploadService,
  ],
  exports: [],
})
export class PaymentModule {}
