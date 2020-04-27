import { User } from '@/entities/user.entity';

export interface IUser {
  username: string;
  email: string;
  password: string;
}

export interface IRequest {
  user: User;
}

export type ILogin = Pick<IUser, 'email' | 'password'>;
