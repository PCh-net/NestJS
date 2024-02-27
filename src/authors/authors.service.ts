import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Author } from '@prisma/client';

@Injectable()
export class AuthorsService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Author[]> {
    return this.prismaService.author.findMany();
  }

  public getById(id: Author['id']): Promise<Author | null> {
    return this.prismaService.author.findUnique({
      where: { id },
    });
  }

  public async create(authorData: Omit<Author, 'id'>): Promise<Author> {
    try {
      return await this.prismaService.author.create({
        data: {
          name: authorData.name,
          country: authorData.country,
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Author is exist');
      throw error;
    }
  }

  public updateById(
    id: Author['id'],
    orderData: Omit<Author, 'id'>,
  ): Promise<Author> {
    return this.prismaService.author.update({
      where: { id },
      data: orderData,
    });
  }

  public deleteById(id: Author['id']): Promise<Author> {
    return this.prismaService.author.delete({
      where: { id },
    });
  }
}
