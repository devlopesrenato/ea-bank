import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './account.repository';
import { AccountEntity } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    private repository: AccountRepository
  ) { }

  async create(createAccountDto: CreateAccountDto): Promise<AccountEntity> {
    if (createAccountDto.openingBalance < 0) {
      throw new BadRequestException("O saldo não pode ser menor que 0.")
    }

    const alreadyExists = await this.repository.getFirstByName(createAccountDto.name);
    if (alreadyExists) {
      throw new ConflictException("Já existe uma conta com este nome.")
    }

    if (!["savings", "checkingAccount"].includes(createAccountDto.type)) {
      throw new BadRequestException('O tipo da conta deve ser "savings" para conta poupança ou "checkingAccount" para conta corrente).')
    }

    return this.repository.create(createAccountDto);
  }

  findAll(): Promise<AccountEntity[]> {
    return this.repository.getAll();
  }

  async findOne(id: number): Promise<AccountEntity> {
    const account = await this.repository.getOneByID(id);
    if (!account) {
      throw new NotFoundException("Conta não encontrada")
    }
    return account
  }

  async update(id: number, updateAccountDto: UpdateAccountDto): Promise<AccountEntity> {
    const account = await this.repository.getOneByID(id);
    if (!account) {
      throw new NotFoundException("Conta não encontrada")
    }

    const alreadyExists = await this.repository.getFirstByName(updateAccountDto.name);
    if (alreadyExists && alreadyExists.id !== id) {
      throw new ConflictException("Já existe uma conta com este nome.")
    }

    return this.repository.update(id, updateAccountDto);
  }

  async remove(id: number): Promise<AccountEntity> {
    const account = await this.repository.getOneByID(id);
    if (!account) {
      throw new NotFoundException("Conta não encontrada")
    }

    return this.repository.delete(id);
  }
}
