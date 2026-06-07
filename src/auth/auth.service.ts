import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  async create(data: RegisterDto) {
    const hash = await bcrypt.hash(data.password, 10);

    console.log({ ...data, password: hash });
    return 'User registered successfully';
  }
  login() {
    return 'Login successful';
  }

  findAll() {
    return 'All users';
  }

  findOne(id: number) {
    return `User ${id}`;
  }

  update(id: number) {
    return `User ${id} updated`;
  }

  remove(id: number) {
    return `User ${id} deleted`;
  }
}
