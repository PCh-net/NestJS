import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, User } from '@prisma/client';

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
  public getByEmail(email: User['email']): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { password: true },
    });
  }

  public async createUser(userData: Omit<User, 'id'>): Promise<User> {
    const { email, ...otherData } = userData;
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const password = 'hashedpass';
    return await this.prismaService.user.create({
      data: {
        ...otherData,
        email,
        password: {
          create: {
            hashedPassword: password,
          },
        },
      },
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
      // hashedPassword = await bcrypt.hash(password, 10);
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
