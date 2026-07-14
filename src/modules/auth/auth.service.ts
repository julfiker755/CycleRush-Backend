import { Injectable } from '@nestjs/common';
import {
  EmailDto,
  LoginDto,
  NewPasswordDto,
  OtpDto,
  RegisterDto,
} from './dto/register.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Auth } from './schemas/user.schema';
import { Connection, Model, Types } from 'mongoose';
import { throwCustomErrors } from '../../utils/errors.interceptor';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Profile } from './schemas/profile.schema';
import bcrypt from 'bcrypt';
import { updateDto } from './dto/update-profile.dto';
import { StorageService } from '../../utils/storage.service';
import { fileName } from '../../utils/fun.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<Auth>,
    @InjectModel(Profile.name)
    private profileModel: Model<Profile>,
    @InjectConnection()
    private readonly connection: Connection,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private storageService: StorageService,
  ) {}
  async create(data: RegisterDto) {
    const hash = await bcrypt.hash(data.password, 10);
    const userPaylod = {
      ...data,
      password: hash,
    };

    const existingUser = await this.authModel.findOne({ email: data.email });
    if (existingUser) {
      throwCustomErrors('Email already exists', [
        { field: 'email', message: 'Email already exists' },
      ]);
    }

    const session = await this.connection.startSession();

    try {
      const userData = await session.withTransaction(async () => {
        const [user] = await this.authModel.create([{ ...userPaylod }], {
          session,
        });

        await this.profileModel.create(
          [{ user: user._id, name: userPaylod.name }],
          {
            session,
          },
        );

        return user;
      });

      return {
        message: 'User registered successfully',
        data: userData,
      };
    } finally {
      await session.endSession();
    }
  }

  async login(data: LoginDto) {
    const user = await this.authModel.findOne({ email: data.email });
    if (!user) {
      throwCustomErrors('User not found', [
        { field: 'email', message: 'User not found' },
      ]);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throwCustomErrors('Invalid password', [
        { field: 'password', message: 'Invalid password' },
      ]);
    }

    const token = this.jwtService.sign({
      sub: user._id,
      role: user.role,
    });

    return {
      message: 'User login in successfully',
      data: {
        token: token,
        user: user,
      },
    };
  }

  async findAll() {
    const res = await this.authModel.find();

    return {
      message: 'All users found successfully',
      data: res,
    };
  }

  async findProfile(id: any) {
    const res = await this.profileModel
      .findOne({ user: new Types.ObjectId(id) })
      .populate(
        'user',
        '-password -is_email_verified -is_phone_verified -created_at -updated_at -role',
      )
      .select('-created_at -updated_at')
      .lean()
      .exec();

    return {
      message: 'User profile found successfully',
      data: res,
    };
  }
  async profileUpdate(id: string, body: updateDto, avatar?: any) {
    const user = new Types.ObjectId(id);
    const profile = await this.profileModel.findOne({ user }).lean();

    if (avatar) {
      const { url } = await this.storageService.upload('user', avatar);
      body.avatar = url;
    }

    const updated = await this.profileModel.findOneAndUpdate(
      { user },
      { $set: body },
      { new: true },
    );

    if (avatar && profile?.avatar) {
      void this.storageService.remove('user', fileName(profile.avatar));
    }

    return {
      message: 'Profile updated successfully',
      data: updated,
    };
  }
  async forgotPassword(emailDto: EmailDto) {
    const user = await this.authModel.findOne({
      email: emailDto.email,
    });

    if (!user) {
      throwCustomErrors('User not found', [
        { field: 'email', message: 'User not found' },
      ]);
    }
    const profile = await this.profileModel.findOne({
      user: new Types.ObjectId(user._id),
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.mailerService.sendMail({
      to: user?.email,
      subject: 'Welcome!',
      template: 'password.hbs',
      context: {
        name: profile?.name,
        code: code,
        year: new Date().getFullYear(),
      },
    });

    await this.authModel.findByIdAndUpdate(user._id, {
      $set: {
        otp: code,
      },
    });

    return {
      message: 'Password reset successfully',
      data: user?.email,
    };
  }

  async verifyOtp(dto: OtpDto) {
    const user = await this.authModel.findOne({ email: dto.email });

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
    if (data?.password === data?.confirm_password) {
      throwCustomErrors('Validation failed', [
        {
          field: 'confirm_password',
          message: 'Passwords do not match',
        },
      ]);
    }

    const { email } = await this.jwtService.verifyAsync(data.token);

    const hash = await bcrypt.hash(data?.password, 10);

    await this.authModel.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hash,
          otp: '',
        },
      },
      { new: true },
    );

    return { message: 'Password updated successfully' };
  }
}
