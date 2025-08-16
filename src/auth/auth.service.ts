import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private cfg: ConfigService,
  ) {}

  async register(email: string, password: string, name: string) {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('Email already registered');

    const hash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hash, name },
    });

    return this.sign(user.id, user.email, user.name);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException();

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException();

    return this.sign(user.id, user.email, user.name);
  }

  async sign(id: number, email: string, name: string) {
    const payload = { sub: id, email, name };
    const secret = this.cfg.get<string>('JWT_SECRET')!;
    const expiresIn = this.cfg.get<string>('JWT_EXPIRES_IN') || '15m';

    return { access_token: this.jwt.sign(payload, { secret, expiresIn }) };
  }
}
