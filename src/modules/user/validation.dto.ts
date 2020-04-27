import { IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

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

// tslint:disable-next-line:max-classes-per-file
export class LoginUserDto {
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

// tslint:disable-next-line:max-classes-per-file
export class RequestPasswordResetDto {
  @IsEmail()
  email: string;
}

// tslint:disable-next-line:max-classes-per-file
export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  password: string;
}
