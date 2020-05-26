import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'password too short',
  })
  @MaxLength(15, {
    message: 'Whoooah! slow down autobot, that password is too long',
  })
  password: string;
}
