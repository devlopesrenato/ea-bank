import { CreatePaymentDto } from 'src/payment/dto/create-payment.dto';
import { PaymentEntity } from 'src/payment/entities/payment.entity';

export class MockPaymentRepository {
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

  async getAll(): Promise<PaymentEntity[]> {
    return this.paymentsMock;
  }

  async getAllByAccount(findAccountId: number): Promise<PaymentEntity[]> {
    return this.paymentsMock.filter(
      ({ accountId }) => accountId === findAccountId,
    );
  }

  async getOneByID(findId: number): Promise<PaymentEntity> {
    return this.paymentsMock.find(({ id }) => id === findId);
  }

  async getFirstByDescription(findDescription: string): Promise<PaymentEntity> {
    return this.paymentsMock.find(
      ({ description }) => description === findDescription,
    );
  }

  async create(createAccpuntDto: CreatePaymentDto): Promise<PaymentEntity> {
    return {
      id: 3,
      ...createAccpuntDto,
    };
  }
}
