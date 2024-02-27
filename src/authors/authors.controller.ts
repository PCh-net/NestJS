import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { AuthorsService } from './authors.service';
import { ParseUUIDPipe } from '@nestjs/common';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}
  @Get('/')
  getAll(): any {
    return this.authorsService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const product = await this.authorsService.getById(id);
    if (!product) throw new NotFoundException('Author not found');
    return product;
  }
}
