import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  public async createAccessToken(userId: number) {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  public async createAccessTokenWithTime(userId: number, expires: string) {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: expires,
    });
  }

  public async validateUser(jwtPayload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: jwtPayload?.userId,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrando');
    }
    return user;
  }

  private jwtExtractor(request: Request): string {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('Token não enviado');
    }
    const [, token] = authHeader.split(' ');

    return token;
  }

  public async extractDataFromToken(token: string) {
    try {
      const decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;
      return decoded.userId;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Token inválido');
    }
  }

  public returnJwtExtractor(): (request: Request) => string {
    return this.jwtExtractor;
  }
}
