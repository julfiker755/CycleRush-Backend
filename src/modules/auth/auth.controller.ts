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
import {
  ChangePasswordDto,
  EmailDto,
  LoginDto,
  NewPasswordDto,
  OtpDto,
  RegisterDto,
} from './dto/register.dto';
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
  @Post('google')
  google() {
    return this.authService.google();
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
  @Post('varify-otp')
  varifyOtp(@Body() otpDto: OtpDto) {
    return this.authService.verifyOtp(otpDto);
  }
  @Post('new-password')
  newPassword(@Body() data: NewPasswordDto) {
    return this.authService.newPassword(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('change-password')
  changePassword(@Request() req, @Body() body:ChangePasswordDto) {
    const id = req.user.sub;
    return this.authService.changePassword(id, body);
  }
}
