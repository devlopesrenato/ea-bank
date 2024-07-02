import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAccountDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}
