import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { AccountStatementReportDto } from './dto/account-statement-report.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('report')
@UseGuards(AuthGuard('jwt'))
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  @Get('account-statement')
  async accountStatement(
    @Body() accountStatementReportDto: AccountStatementReportDto,
  ) {
    return this.reportService.accountStatement(accountStatementReportDto);
  }
}
