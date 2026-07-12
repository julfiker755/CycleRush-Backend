import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailDto, LoginDto, RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { Role, Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { updateDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Authentication')
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Request() req) {
    const id = req.user.sub;
    return this.authService.findProfile(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('profile')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  profileUpdate(
    @Request() req,
    @UploadedFile() avatar: File,
    @Body() body: updateDto,
  ) {
    const id = req.user.sub;
    console.log(body);
    return this.authService.profileUpdate(id, body, avatar);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('all')
  findAll() {
    return this.authService.findAll();
  }

  @Post('forgot-password')
  forgotPassword(@Body() emailDto: EmailDto) {
    return this.authService.forgotPassword(emailDto);
  }
}
