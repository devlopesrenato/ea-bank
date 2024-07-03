import { PaymentEntity } from 'src/payment/entities/payment.entity';
import { AccountStatementReportDto } from 'src/report/dto/account-statement-report.dto';

export class MockReportRepository {
  private paymentsMock: PaymentEntity[] = [
    {
      id: 1,
      accountId: 1,
      value: 500,
      date: new Date(2024, 6, 2, 21, 0, 0),
      description: 'Payment Test 1',
    },
    {
      id: 2,
      accountId: 2,
      value: 500,
      date: new Date(2024, 6, 2, 21, 0, 0),
      description: 'Payment Test 2',
    },
  ];

  async getPaymentsByAccountAndPeriod(
    accountStatementReportDto: AccountStatementReportDto,
  ): Promise<Partial<PaymentEntity>[]> {
    const dateStart = new Date(accountStatementReportDto.dateStart);
    const dateEnd = new Date(accountStatementReportDto.dateEnd);
    return this.paymentsMock.filter(({ accountId, date }) => {
      return (
        accountId === accountStatementReportDto.accountId &&
        date >= dateStart &&
        date <= dateEnd
      );
    });
  }
}
