import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AccountEntity } from "./entities/account.entity";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";

@Injectable()
export class AccountRepository {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getAll(): Promise<AccountEntity[]> {
        return this.prismaService.account.findMany();
    }

    async getOneByID(id: number): Promise<AccountEntity> {
        return this.prismaService.account.findUnique({
            where: { id }
        });
    }

    async getFirstByName(name: string): Promise<AccountEntity> {
        return this.prismaService.account.findFirst({
            where: { name }
        });
    }

    async create(createAccountDto: CreateAccountDto) {
        return this.prismaService.account.create({
            data: createAccountDto
        })
    }

    async update(id: number, updateAccountDto: UpdateAccountDto) {
        return this.prismaService.account.update({
            where: { id },
            data: updateAccountDto
        })
    }

    async delete(id: number) {
        return this.prismaService.account.delete({
            where: { id }
        })
    }

}