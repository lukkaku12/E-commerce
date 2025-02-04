import { 
    IsEmail, 
    IsString, 
    MinLength, 
    MaxLength, 
    IsOptional,
    IsIn 
  } from 'class-validator';
import { UserRole } from '../entities/user.entity';
  
  export class CreateUserDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;
  
    @IsEmail()
    email: string;
  
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    password: string;
  
    @IsOptional()
    @IsIn(['buyer', 'seller'])
    role?: UserRole;
  }