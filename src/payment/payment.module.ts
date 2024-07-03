import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentRepository } from './payment.repository';
import { AccountRepository } from 'src/account/account.repository';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PrismaService,
    PaymentRepository,
    AccountRepository,
  ],
})
export class PaymentModule {}
