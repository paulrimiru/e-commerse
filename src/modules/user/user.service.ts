import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

import { USER_REPOSITORY } from '@/utils/constants';
import { User } from '@/entities/user.entity';
import { IUser } from '@/utils/interfaces';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    return await this.userRepository.findOne(id);
  }

  async createUser(userDetails: IUser): Promise<User> {
    const isExistingUser = await this.isUserSaved(userDetails.email);
    if (isExistingUser) {
      throw new HttpException(
        'user with that email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = new User();
    user.email = userDetails.email;
    user.username = userDetails.username;
    await user.setPassword(userDetails.password);

    return await this.userRepository.save(user);
  }

  async updateUser(updatedUser: User): Promise<User> {
    return await this.userRepository.save(updatedUser);
  }

  async isUserSaved(email: string) {
    return !!(await this.findByEmail(email));
  }

  encode = (data): string =>
    Buffer.from(data)
      .toString('base64')
      .toString();

  decode = (data: string) => {
    const decoded = Buffer.from(data, 'base64').toString();
    return decoded;
  };
}
