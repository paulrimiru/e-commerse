import { User } from '@/entities/user.entity';
import { UserService } from '@/modules/user/user.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UserService) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const passwordMatch = await user.checkPassword(pass);

    if (passwordMatch) {
      return user;
    }

    return null;
  }

  async generateToken({ email, id }: User) {
    return {
      access_token: 'coming soon, lets get everything done first',
    };
  }
}
