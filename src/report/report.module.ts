import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { AccountService } from '../account/account.service';
import { ReportRepository } from './report.repository';
import { PaymentRepository } from '../payment/payment.repository';
import { AccountRepository } from '../account/account.repository';
import { UploadService } from 'src/upload/upload.service';

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
    UploadService,
  ],
})
export class ReportModule {}
