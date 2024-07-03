import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private saltRounds = +process.env.BCRYPT_SALT_ROUNDS;

  constructor(
    private readonly repository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUserData> {
    const user = await this.repository.findFirstByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('Já existe uma conta com o email informado');
    }
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      this.saltRounds,
    );

    const userCreated = await this.repository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return {
      id: userCreated.id,
      name: userCreated.name,
      email: userCreated.email,
    };
  }

  async update(
    updateUserDto: UpdateUserDto,
    userID: number,
  ): Promise<IUserData> {
    const user = await this.repository.findOne(userID);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto?.email) {
      const userEmail = await this.repository.findFirstByEmail(
        updateUserDto.email,
        userID,
      );
      if (userEmail) {
        throw new ConflictException(
          'Já existe uma conta com o email informado',
        );
      }
    }

    const hashedPassword = updateUserDto.newPassword
      ? await bcrypt.hash(updateUserDto.newPassword, this.saltRounds)
      : undefined;

    const userUpdated = await this.repository.update(userID, {
      email: updateUserDto.email,
      name: updateUserDto.name,
      password: hashedPassword,
    });

    delete userUpdated.password;
    return { ...userUpdated };
  }

  public async login(loginDto: LoginDto): Promise<IUserLogin> {
    const user: UserEntity = await this.repository.findFirstByEmail(
      loginDto.email,
    );
    if (!user) {
      throw new UnauthorizedException('Dados de login inválidos');
    }
    const match: boolean = await this.checkPassword(loginDto.password, user);
    if (!match) {
      throw new UnauthorizedException('Dados de login inválidos');
    }
    const jwtToken = await this.authService.createAccessToken(user.id);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      jwtToken: jwtToken,
    };
  }

  private async checkPassword(
    pass: string,
    user: UserEntity,
  ): Promise<boolean> {
    const match = await bcrypt.compare(pass, user.password);
    if (!match) {
      throw new UnauthorizedException('Dados de login inválidos');
    }
    return match;
  }
}
