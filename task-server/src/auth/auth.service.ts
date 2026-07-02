import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { JwtSignOptions } from '@nestjs/jwt';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

const PASSWORD_SALT_ROUNDS = 10;
const REFRESH_TOKEN_SALT_ROUNDS = 10;
const refreshTokenExpiresIn = (
  process.env.JWT_REFRESH_EXPIRES_IN ?? '7d'
) as JwtSignOptions['expiresIn'];
const refreshTokenSecret =
  process.env.JWT_REFRESH_SECRET ??
  process.env.JWT_SECRET ??
  'local-dev-jwt-secret';
const userSelect = {
  id: true,
  email: true,
  nickname: true,
  role: true,
  status: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
};

interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: registerAuthDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(
      registerAuthDto.password,
      PASSWORD_SALT_ROUNDS,
    );

    const user = await this.prisma.user.create({
      data: {
        email: registerAuthDto.email,
        password: hashedPassword,
        nickname: registerAuthDto.nickname,
      },
      select: userSelect,
    });

    return user;
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    if (user.status === 'disabled') {
      throw new ForbiddenException('用户已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(
      loginAuthDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      role: user.role,
      status: user.status,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    const tokens = await this.createTokenPair(user.id, user.email);

    return {
      ...tokens,
      user: safeUser,
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);

    const refreshTokenRecord = await this.prisma.refreshToken.findFirst({
      where: {
        id: payload.tokenId,
        userId: payload.sub,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!refreshTokenRecord) {
      throw new UnauthorizedException('refresh token 已失效');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      refreshTokenRecord.tokenHash,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('refresh token 已失效');
    }

    if (refreshTokenRecord.user.status === 'disabled') {
      throw new ForbiddenException('用户已被禁用');
    }

    await this.prisma.refreshToken.delete({
      where: {
        id: refreshTokenRecord.id,
      },
    });

    const tokens = await this.createTokenPair(
      refreshTokenRecord.user.id,
      refreshTokenRecord.user.email,
    );

    return {
      ...tokens,
      user: {
        id: refreshTokenRecord.user.id,
        email: refreshTokenRecord.user.email,
        nickname: refreshTokenRecord.user.nickname,
        role: refreshTokenRecord.user.role,
        status: refreshTokenRecord.user.status,
        avatarUrl: refreshTokenRecord.user.avatarUrl,
        createdAt: refreshTokenRecord.user.createdAt,
        updatedAt: refreshTokenRecord.user.updatedAt,
      },
    };
  }

  async logout(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);

    await this.prisma.refreshToken.deleteMany({
      where: {
        id: payload.tokenId,
        userId: payload.sub,
      },
    });

    return true;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl,
      },
      select: userSelect,
    });
  }

  private async createTokenPair(userId: string, email: string) {
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      email,
    });
    const refreshToken = await this.createRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createRefreshToken(userId: string) {
    const tokenId = randomUUID();
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        tokenId,
      },
      {
        secret: refreshTokenSecret,
        expiresIn: refreshTokenExpiresIn,
      },
    );
    const tokenHash = await bcrypt.hash(refreshToken, REFRESH_TOKEN_SALT_ROUNDS);

    await this.prisma.refreshToken.create({
      data: {
        id: tokenId,
        tokenHash,
        expiresAt: this.getRefreshTokenExpiresAt(),
        userId,
      },
    });

    return refreshToken;
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: refreshTokenSecret,
        },
      );
    } catch {
      throw new UnauthorizedException('refresh token 已失效');
    }
  }

  private getRefreshTokenExpiresAt() {
    return new Date(Date.now() + this.parseDurationToMilliseconds(
      process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    ));
  }

  private parseDurationToMilliseconds(duration: string) {
    const match = duration.trim().match(/^(\d+)([smhd])$/);

    if (!match) {
      return 7 * 24 * 60 * 60 * 1000;
    }

    const value = Number(match[1]);
    const unit = match[2];
    const unitMap: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return value * unitMap[unit];
  }
}
