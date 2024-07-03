import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { AccountStatementReportDto } from './dto/account-statement-report.dto';

@Injectable()
export class ReportRepository {
  constructor(private prismaService: PrismaService) {}

  async getPaymentsByAccountAndPeriod(
    accountStatementReportDto: AccountStatementReportDto,
  ): Promise<Partial<PaymentEntity>[]> {
    const dateStart = new Date(accountStatementReportDto.dateStart);
    const dateEnd = new Date(accountStatementReportDto.dateEnd);
    return this.prismaService.payment.findMany({
      select: {
        id: true,
        description: true,
        date: true,
        value: true,
      },
      where: {
        accountId: accountStatementReportDto.accountId,
        date: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
    });
  }
}
