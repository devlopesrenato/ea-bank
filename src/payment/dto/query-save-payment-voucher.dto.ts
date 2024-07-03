import { IsNumberString } from 'class-validator';

export class QuerySavePaymentVoucherDto {
  @IsNumberString()
  paymentId: string;
}
