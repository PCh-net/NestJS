import { Controller } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Controller('authors')
export class AuthorsController {
  constructor(private prismaService: PrismaService) {}
}
