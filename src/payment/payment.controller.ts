import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FiltersPaymentDto } from './dto/filters-payment.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuerySavePaymentVoucherDto } from './dto/query-save-payment-voucher.dto';

@Controller('payment')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Post('payment-voucher')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query() queryParams: QuerySavePaymentVoucherDto,
  ) {
    return this.paymentService.savePaymentVoucher(
      file.buffer,
      +queryParams.paymentId,
    );
  }

  @Get()
  findAll(@Query() filtersPaymentDto?: FiltersPaymentDto) {
    return this.paymentService.findAll(filtersPaymentDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }
}
