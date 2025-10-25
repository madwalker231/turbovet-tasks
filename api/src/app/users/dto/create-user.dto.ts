import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '@turbovet-tasks/data-models';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.'})
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  // Organization ID not included. This will be forced by services.
}
