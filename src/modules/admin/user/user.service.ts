import { Profile } from '@/modules/auth/schemas/profile.schema';
import { Auth } from '@/modules/auth/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Auth.name)
    private authModel: Model<Auth>,
    @InjectModel(Profile.name)
    private profileModel: Model<Profile>,
  ) {}

  create(createUserDto: any) {
    return 'This action adds a new user';
  }

  async findAll() {
    const user = await this.profileModel.find();
    return user;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
