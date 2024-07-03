import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { FiltersPaymentDto } from './dto/filters-payment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('payment')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
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
