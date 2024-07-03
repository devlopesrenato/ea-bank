import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRepository } from './payment.repository';
import { AccountRepository } from '../account/account.repository';
import { FiltersPaymentDto } from './dto/filters-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    private repository: PaymentRepository,
    private accountRepository: AccountRepository,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const account = await this.accountRepository.getOneByID(
      createPaymentDto.accountId,
    );
    if (!account) {
      throw new NotFoundException('A conta informada não foi encontrada');
    }

    const descriptionAlreadyExists =
      await this.repository.getFirstByDescription(createPaymentDto.description);
    if (
      descriptionAlreadyExists &&
      descriptionAlreadyExists.accountId === createPaymentDto.accountId
    ) {
      throw new ConflictException(
        'Já existe um pagamento com essa descrição para esta conta',
      );
    }

    const balance = await this.getAccountBalance(createPaymentDto.accountId);
    if (balance < createPaymentDto.value) {
      throw new BadRequestException(
        'Saldo insuficiente para realizar o pagamento',
      );
    }

    return this.repository.create(createPaymentDto);
  }

  async findAll(filtersPaymentDto: FiltersPaymentDto) {
    if (filtersPaymentDto?.accountId) {
      const account = await this.accountRepository.getOneByID(
        +filtersPaymentDto.accountId,
      );
      if (!account) {
        throw new NotFoundException('Conta não encontrada');
      }
      return this.repository.getAllByAccount(+filtersPaymentDto.accountId);
    }
    return this.repository.getAll();
  }

  async findOne(id: number) {
    const payment = await this.repository.getOneByID(id);
    if (!payment) {
      throw new NotFoundException('Transação não encontrada');
    }
    return payment;
  }

  async getAccountBalance(accountId: number): Promise<number> {
    const allAccountTransactions =
      await this.repository.getAllByAccount(accountId);
    const account = await this.accountRepository.getOneByID(accountId);
    if (!allAccountTransactions.length) return account.openingBalance;
    const totalPayments = allAccountTransactions.reduce((prev, cur) => {
      prev += cur.value;
      return prev;
    }, 0);
    const balance = account.openingBalance - totalPayments;
    return balance;
  }
}
