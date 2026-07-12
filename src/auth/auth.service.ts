import { Injectable } from '@nestjs/common';
import { EmailDto, LoginDto, RegisterDto } from './dto/register.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Auth } from './schemas/user.schema';
import { Connection, Model, Types } from 'mongoose';
import { throwCustomErrors } from '../utils/errors.interceptor';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Profile } from './schemas/profile.schema';
import bcrypt from 'bcrypt';
import { updateDto } from './dto/update-profile.dto';

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
  async profileUpdate(id: any, body: updateDto, avater: File) {
    console.log(body);
    console.log(avater);
    return id;
  }
  async forgotPassword(emailDto: EmailDto) {
    const res = await this.authModel.findOne({ email: emailDto.email });
    if (!res) {
      throwCustomErrors('User not found', [
        { field: 'email', message: 'User not found' },
      ]);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await this.mailerService.sendMail({
      to: res.email,
      subject: 'Welcome!',
      template: 'password.hbs',
      context: {
        name: 'fff',
        code: code,
        year: new Date().getFullYear(),
      },
    });
    return {
      message: 'Password reset successfully',
      data: res,
    };
  }
}
