
import { IsNotEmpty, IsNumber, IsString, isString } from "class-validator";

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsNumber()
    @IsNotEmpty()
    openingBalance: number;
}
