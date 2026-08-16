import { Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  EmailDto,
  LoginDto,
  NewPasswordDto,
  OtpDto,
  RegisterDto,
} from '@/modules/auth/dto/register.dto';
import { throwCustomErrors } from '@/utils/errors.interceptor';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import bcrypt from 'bcrypt';
import { updateDto } from '@/modules/auth/dto/update-profile.dto';
import { StorageService } from '@/utils/storage.service';
import { fileName } from '@/utils/fun.utils';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private storageService: StorageService,
  ) {}

  async create(data: RegisterDto) {
    const hash = await bcrypt.hash(data.password, 10);

    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throwCustomErrors('Email already exists', [
        { field: 'email', message: 'Email already exists' },
      ]);
    }

    const userData = await this.prisma.user.create({
      data: {
        email: data.email,
        contact_number: data.contact_number,
        password: hash,
        profile: {
          create: {
            name: data.name,
          },
        },
      },
      select: {
        id: true,
        email: true,
        contact_number: true,
        role: true,
        profile: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
    });

    return {
      message: 'User registered successfully',
      data: userData,
    };
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throwCustomErrors('User not found', [
        { field: 'email', message: 'User not found' },
      ]);
    }

    if (user.provider === 'google') {
      throwCustomErrors('This account uses Google Sign-In only', []);
    }

    if (!user.password) {
      throwCustomErrors('Invalid password', [
        { field: 'password', message: 'Invalid password' },
      ]);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throwCustomErrors('Invalid password', [
        { field: 'password', message: 'Invalid password' },
      ]);
    }

    const token = this.jwtService.sign({
      sub: user.id,
      role: user.role,
    });

    const { password, ...rest } = user;

    return {
      message: 'User login in successfully',
      data: {
        token: token,
        user: rest,
      },
    };
  }

  async googleLogin(profile: any) {
    const { email, firstName, lastName, picture } = profile;

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing && existing.provider === 'normal') {
      throwCustomErrors('This email is registered with normal login', []);
    }

    const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {
        provider: 'google',
        is_email_verified: true,
        profile: {
          upsert: {
            create: {
              name: fullName,
              avatar: picture,
            },
            update: {
              name: fullName,
              avatar: picture,
            },
          },
        },
      },
      create: {
        email,
        provider: 'google',
        is_email_verified: true,
        profile: {
          create: {
            name: fullName,
            avatar: picture,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = this.jwtService.sign({ sub: user.id, role: user.role });

    return {
      message: 'User logged in successfully with Google',
      data: { token, user: user },
    };
  }

  async findProfile(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            contact_number: true,
            provider: true,
          },
        },
      },
    });

    return {
      message: 'User profile found successfully',
      data: profile,
    };
  }

  async profileUpdate(id: string, body: updateDto, avatar?: any) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId: id },
    });

    if (avatar) {
      const { url } = await this.storageService.upload('user', avatar);
      body.avatar = url;
    }

    const updateData: Record<any, any> = {
      ...body,
    };

    const updated = await this.prisma.profile.update({
      where: { userId: id },
      data: updateData,
    });

    if (avatar && profile?.avatar) {
      void this.storageService.remove('user', fileName(profile.avatar));
    }

    return {
      message: 'Profile updated successfully',
      data: updated,
    };
  }

  async forgotPassword(emailDto: EmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: emailDto.email },
      include: { profile: true },
    });

    if (!user) {
      throwCustomErrors('User not found', [
        { field: 'email', message: 'User not found' },
      ]);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const frontendurl = `${process.env.FRONTEND_URL}/auth/varify-otp?email=${user.email}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome!',
      template: 'password.hbs',
      context: {
<<<<<<< HEAD
        frontendurl: frontendurl,
=======
>>>>>>> 302ce8c28eff314e4e48ae3bfbd4c09b72cf1a41
        name: user.profile?.name,
        code: code,
        year: new Date().getFullYear(),
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { otp: code },
    });

    return {
      message: "We've sent an OTP to your email",
      data: {
        email: user.email,
      },
    };
  }

  async verifyOtp(dto: OtpDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throwCustomErrors('User not found', [
        { field: 'email', message: 'User not found' },
      ]);
    }

    if (user.otp !== dto.otp) {
      throwCustomErrors('Invalid OTP', [
        { field: 'otp', message: 'Invalid OTP' },
      ]);
    }

    const token = this.jwtService.sign({
      email: user.email,
    });

    return {
      message: 'OTP verified successfully',
      data: { token },
    };
  }

  async newPassword(data: NewPasswordDto) {
    if (data?.password !== data?.confirm_password) {
      throwCustomErrors('Validation failed', [
        {
          field: 'confirm_password',
          message: 'Passwords do not match',
        },
      ]);
    }

    const { email } = await this.jwtService.verifyAsync(data.token);
    const hash = await bcrypt.hash(data.password, 10);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hash,
        otp: '',
      },
    });

    return { message: 'Password updated successfully', data: null };
  }

  async changePassword(id: string, data: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throwCustomErrors('User not found', [
        { field: 'id', message: 'No user found' },
      ]);
    }

    if (!user.password) {
      throwCustomErrors('Validation failed', [
        { field: 'password', message: 'Current password is wrong' },
      ]);
    }

    const isMatch = await bcrypt.compare(data.current_password, user.password);
    if (!isMatch) {
      throwCustomErrors('Validation failed', [
        { field: 'password', message: 'Current password is wrong' },
      ]);
    }

    if (data.password !== data.confirm_password) {
      throwCustomErrors('Validation failed', [
        { field: 'confirm_password', message: 'Passwords do not match' },
      ]);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
      select: {
        id: true,
        email: true,
        contact_number: true,
        role: true,
        is_email_verified: true,
        is_phone_verified: true,
        provider: true,
        created_at: true,
        updated_at: true,
      },
    });

    return { message: 'Password updated successfully', data: updatedUser };
  }
}
