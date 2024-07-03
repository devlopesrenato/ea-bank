import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { AccountService } from '../account/account.service';
import { ReportRepository } from './report.repository';
import { PaymentRepository } from '../payment/payment.repository';
import { AccountRepository } from '../account/account.repository';

@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    ReportRepository,
    PrismaService,
    PaymentService,
    PaymentRepository,
    AccountService,
    AccountRepository,
  ],
})
export class ReportModule {}
