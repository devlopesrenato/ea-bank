import { BadRequestException, Injectable } from '@nestjs/common';
import { AccountStatementReportDto } from './dto/account-statement-report.dto';
import { PaymentService } from '../payment/payment.service';
import { AccountService } from '../account/account.service';
import { ReportRepository } from './report.repository';

@Injectable()
export class ReportService {
  constructor(
    private readonly repository: ReportRepository,
    private readonly paymentService: PaymentService,
    private readonly accountService: AccountService,
  ) {}

  async accountStatement(accountStatementReportDto: AccountStatementReportDto) {
    const { dateStart, dateEnd, accountId } = accountStatementReportDto;
    if (dateEnd < dateStart) {
      throw new BadRequestException(
        'A data final não pode ser menor que a data inicial',
      );
    }
    const account = await this.accountService.findOne(accountId);

    const payments = await this.repository.getPaymentsByAccountAndPeriod(
      accountStatementReportDto,
    );

    const balance = await this.paymentService.getAccountBalance(accountId);

    const paymentsTemp = [...payments];
    const totalPaymentsInThePeriod = paymentsTemp.reduce((prev, cur) => {
      prev += cur.value;
      return prev;
    }, 0);

    return {
      ...account,
      currentBalance: balance,
      totalPaymentsInThePeriod,
      payments,
    };
  }
}
