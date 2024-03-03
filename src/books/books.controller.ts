import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Delete,
  Post,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { ParseUUIDPipe } from '@nestjs/common';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LikeBookDTO } from './dtos/like-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/')
  getAll(): any {
    return this.booksService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found, no deleted');
    await this.booksService.deleteById(id);
    return { success: true };
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() bookData: CreateBookDTO) {
    return this.booksService.create(bookData);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found, no edit');
    await this.booksService.updateById(id, bookData);
    return { success: true };
  }

  @Post('like')
  @UseGuards(JwtAuthGuard)
  async likeBook(@Body() likeBookData: LikeBookDTO) {
    const book = await this.booksService.getById(likeBookData.bookId);
    if (!book) throw new NotFoundException('bookId not found');
    await this.booksService.likeBook(likeBookData.bookId, likeBookData.userId);
    return { success: true };
  }
}
