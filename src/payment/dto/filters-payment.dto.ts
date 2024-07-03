import { IsOptional, IsString } from 'class-validator';

export class FiltersPaymentDto {
  @IsString()
  @IsOptional()
  accountId: string;
}
