import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { Role, Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Request() req) {
    const id = req.user.sub;
    return this.authService.findProfile(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('all')
  findAll() {
    return this.authService.findAll();
  }
}
