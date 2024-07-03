import { Payment } from '@prisma/client';

export class PaymentEntity implements Payment {
  id: number;
  accountId: number;
  value: number;
  date: Date;
  description: string;
}
