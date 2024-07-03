import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class AccountStatementReportDto {
  @IsNumber()
  @IsNotEmpty()
  accountId: number;

  @IsDateString({ strict: true, strictSeparator: true })
  @IsNotEmpty()
  dateStart: Date;

  @IsDateString({ strict: true, strictSeparator: true })
  @IsNotEmpty()
  dateEnd: Date;
}
