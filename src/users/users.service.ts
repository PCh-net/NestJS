import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Password, Role, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  public getById(id: User['id']): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  public async getByEmail(
    email: User['email'],
  ): Promise<(User & { password: Password }) | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { password: true },
    });
  }

  public async create(userData: {
    email: string;
    password: string;
  }): Promise<User> {
    const { email, password } = userData;
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prismaService.user.create({
      data: {
        email,
        password: {
          create: {
            hashedPassword,
          },
        },
      },
    });
  }

  public deleteById(id: User['id']): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }

  public async updateById(
    userId: string,
    userData: { email?: string; password?: string; role?: Role },
  ): Promise<User> {
    const { email, password, ...otherData } = userData;

    if (email) {
      const emailOwner = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (emailOwner && emailOwner.id !== userId) {
        throw new ConflictException('Email already exists');
      }
    }

    let hashedPassword;

    if (password) {
      hashedPassword = password;
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...otherData,
        ...(email && { email }),
      },
    });

    if (hashedPassword) {
      await this.prismaService.password.update({
        where: { userId },
        data: { hashedPassword },
      });
    }

    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
