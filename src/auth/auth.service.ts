import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  public async register(registrationData: RegisterDTO) {
    return this.usersService.create({
      email: registrationData.email,
      password: registrationData.password,
    });
  }
}
