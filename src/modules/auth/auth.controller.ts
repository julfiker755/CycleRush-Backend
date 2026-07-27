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
import { AuthService } from '@/modules/auth/auth.service';
import {
  ChangePasswordDto,
  EmailDto,
  LoginDto,
  NewPasswordDto,
  OtpDto,
  RegisterDto,
} from '@/modules/auth/dto/register.dto';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { updateDto } from '@/modules/auth/dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleAuthGuard } from '@/modules/auth/google-auth.guard';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiTags,
} from '@nestjs/swagger';

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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Request() req) {
    return this.authService.googleLogin(req.user);
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

  @Post('forgot-password')
  forgotPassword(@Body() emailDto: EmailDto) {
    return this.authService.forgotPassword(emailDto);
  }

  @Post('verify-otp')
  verifyOtp(@Body() otpDto: OtpDto) {
    return this.authService.verifyOtp(otpDto);
  }

  @Post('new-password')
  newPassword(@Body() data: NewPasswordDto) {
    return this.authService.newPassword(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('change-password')
  changePassword(@Request() req, @Body() body: ChangePasswordDto) {
    const id = req.user.sub;
    return this.authService.changePassword(id, body);
  }
}
