import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  create() {
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
