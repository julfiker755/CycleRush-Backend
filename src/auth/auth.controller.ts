import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: createAuthDto) {
    return this.authService.create();  
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
