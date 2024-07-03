import { Body, Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';
import { AccountStatementReportDto } from './dto/account-statement-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @Get('account-statement')
  async accountStatement(
    @Body() accountStatementReportDto: AccountStatementReportDto,
  ) {
    return this.reportService.accountStatement(accountStatementReportDto);
  }
}
