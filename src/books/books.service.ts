import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({
      include: { author: true },
    });
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  public deleteById(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }

  public async create(
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { title, authorId, ...otherData } = bookData;
    const existingBook = await this.prismaService.book.findUnique({
      where: { title },
    });
    if (existingBook) {
      throw new ConflictException('Book with this title already exists');
    }
    try {
      return await this.prismaService.book.create({
        data: {
          ...otherData,
          title,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new BadRequestException("Author doesn't exist");
      throw error;
    }
  }

  public async updateById(
    id: Book['id'],
    bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { title, authorId, ...otherData } = bookData;
    const existingBook = await this.prismaService.book.findUnique({
      where: { title },
    });
    if (existingBook) {
      throw new ConflictException('Book with this title already exists');
    }
    try {
      return this.prismaService.book.update({
        where: { id },
        data: {
          ...otherData,
          title,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025')
        throw new BadRequestException("Author doesn't exist");
      throw error;
    }
  }

  public async likeBook(bookId: string, userId: string) {
    const alreadyLiked = await this.prismaService.userOnBooks.findUnique({
      where: {
        bookId_userId: {
          bookId: bookId,
          userId: userId,
        },
      },
    });
    if (alreadyLiked) {
      throw new ConflictException('User already liked this book');
    }
    return await this.prismaService.book.update({
      where: { id: bookId },
      data: {
        users: {
          create: {
            userId: userId,
          },
        },
      },
    });
  }
}
