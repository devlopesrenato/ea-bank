import { CreateAccountDto } from "../../dto/create-account.dto";
import { UpdateAccountDto } from "../../dto/update-account.dto";
import { AccountEntity } from "../../entities/account.entity";

export class MockAccountRepository {
    private accountsMock: AccountEntity[] = [
        { id: 1, name: 'Account 1', type: 'savings', openingBalance: 1000 },
        { id: 2, name: 'Account 2', type: 'checkingAccount', openingBalance: 500 },
    ]
    async getAll(): Promise<AccountEntity[]> {
        return this.accountsMock;
    }

    async getOneByID(findId: number): Promise<AccountEntity> {
        return this.accountsMock.find(({ id }) => id === findId)
    }

    async getFirstByName(findName: string): Promise<AccountEntity> {
        return this.accountsMock.find(({ name }) => name === findName);
    }

    async create(createAccpuntDto: CreateAccountDto): Promise<AccountEntity> {
        return {
            id: 3,
            ...createAccpuntDto
        }
    }

    async update(id: number, updateAccountDto: UpdateAccountDto): Promise<AccountEntity> {
        return {
            id,
            ...updateAccountDto,
            type: "savings",
            openingBalance: 5000,
        }
    }

    async delete(deleteId: number): Promise<AccountEntity> {
        return this.accountsMock.find(({ id }) => id === deleteId)
    }
}