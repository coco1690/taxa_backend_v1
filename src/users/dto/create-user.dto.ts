import {
    IsNotEmpty,
    IsEmail,
    IsOptional,
    IsNumber,
    IsString,
    Matches,
    MinLength,
    MaxLength,
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;
  
    @IsNotEmpty()
    @IsString()
    phone: string;
  
    @IsNotEmpty()
    @Matches(/^\+\d{1,4}$/, { message: 'El dialCode debe comenzar con "+" seguido de 1 a 4 dígitos' })
    dialCode: string; // Ej: +57
  
    @IsOptional()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @IsOptional()
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
  
    @IsNotEmpty()
    @Matches(/^[A-Z]{2}$/, { message: 'El countryCode debe ser un código ISO como CO o US' })
    countryCode: string; // Ej: CO
  
    @IsOptional()
    @IsNumber()
    agencyId?: number; // Solo si es un driver que pertenece a una agencia
  }
  