import { Account } from "@prisma/client";

export class AccountEntity implements Account {
    id: number;
    name: string;
    type: string;
    openingBalance: number;
}
