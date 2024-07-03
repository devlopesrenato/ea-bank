import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async findOne(id: number): Promise<UserEntity> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async findFirstByEmail(email: string, id?: number): Promise<UserEntity> {
    const where: any = {
      email,
    };

    if (id !== undefined) {
      where.id = {
        not: id,
      };
    }
    return this.prismaService.user.findFirst({
      where,
    });
  }
}
