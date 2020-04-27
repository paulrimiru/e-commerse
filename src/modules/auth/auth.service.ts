import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '@/modules/user/user.service';
import { User } from '@/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
      access_token: this.jwtService.sign({ email, sub: id }),
    };
  }
}
