import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: any) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.prisma.profile.findMany({
      include: { user: true },
    });
    return users;
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  update(id: string, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
