import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentEntity } from './entities/payment.entity';
import { PaymentVoucher } from '@prisma/client';

@Injectable()
export class PaymentRepository {
  constructor(private prismaService: PrismaService) {}

  async getAll(): Promise<PaymentEntity[]> {
    return this.prismaService.payment.findMany({
      include: {
        paymentVouchers: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
  }

  async getAllByAccount(accountId: number): Promise<PaymentEntity[]> {
    return this.prismaService.payment.findMany({
      include: {
        paymentVouchers: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      where: {
        accountId,
      },
    });
  }

  async getOneByID(id: number): Promise<PaymentEntity> {
    return this.prismaService.payment.findUnique({
      include: {
        paymentVouchers: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      where: { id },
    });
  }

  async getFirstByDescription(description: string): Promise<PaymentEntity> {
    return this.prismaService.payment.findFirst({
      include: {
        paymentVouchers: {
          select: {
            id: true,
            url: true,
          },
        },
      },
      where: { description },
    });
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    return this.prismaService.payment.create({
      data: createPaymentDto,
    });
  }

  async savePaymentVoucherUrl(
    paymentId: number,
    url: string,
  ): Promise<Partial<PaymentVoucher>> {
    return this.prismaService.paymentVoucher.create({
      select: {
        id: true,
        url: true,
        payment: true,
      },
      data: {
        paymentId,
        url,
      },
    });
  }
}
