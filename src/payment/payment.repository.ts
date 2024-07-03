import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentRepository {
  constructor(private prismaService: PrismaService) {}

  async getAll(): Promise<PaymentEntity[]> {
    return this.prismaService.payment.findMany();
  }

  async getAllByAccount(accountId: number): Promise<PaymentEntity[]> {
    return this.prismaService.payment.findMany({
      where: {
        accountId,
      },
    });
  }

  async getOneByID(id: number): Promise<PaymentEntity> {
    return this.prismaService.payment.findUnique({
      where: { id },
    });
  }

  async getFirstByDescription(description: string): Promise<PaymentEntity> {
    return this.prismaService.payment.findFirst({
      where: { description },
    });
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    return this.prismaService.payment.create({
      data: createPaymentDto,
    });
  }
}
