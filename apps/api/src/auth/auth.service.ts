import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = hashSync(password, 10);
    const user = await this.prisma.user.create({
      data: { name, email, passwordHash },
    });

    const token = this.signToken(user.id, user.email, user.name);
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const valid = compareSync(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.signToken(user.id, user.email, user.name);
    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private signToken(userId: string, email: string, name: string): string {
    return this.jwtService.sign({ sub: userId, email, name });
  }
}
