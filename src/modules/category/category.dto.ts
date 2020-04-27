import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsUrl()
  picture: string;
}

// tslint:disable-next-line:max-classes-per-file
export class UpdateCategoryDto {
  name?: string;
  description?: string;
  picture?: string;
}
