import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth } from './schemas/user.schema';
import { Model } from 'mongoose';
import { throwCustomErrors } from '../utils/errors.interceptor';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private userModel: Model<Auth>,
    private jwtService: JwtService,
  ) {}
  async create(data: RegisterDto) {
    const hash = await bcrypt.hash(data.password, 10);

    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throwCustomErrors('Email already exists', [
        { field: 'email', message: 'Email already exists' },
      ]);
    }

    const userData = {
      ...data,
      password: hash,
    };

    await this.userModel.create(userData);
    return {
      message: 'User registered successfully',
      data: userData,
    };
  }
  async login(data: LoginDto) {
    const user = await this.userModel.findOne({ email: data.email });
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
    const res = await this.userModel.find();

    return {
      message: 'All users found successfully',
      data: res,
    };
  }

  async findProfile(id: number) {
    const res = await this.userModel.findById(id);
    return {
      message: 'User profile found successfully',
      data: res,
    };
  }
}
