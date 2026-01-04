import { IsNotEmpty, IsString, IsPhoneNumber, Matches, IsArray, IsOptional, IsNumber, IsEmail, MinLength, MaxLength } from 'class-validator';

export class RegisterAuthDto {

    @IsNotEmpty()
    @IsString()
    fullName: string;

    // @IsOptional()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsNotEmpty()
    @Matches(/^\+\d{1,4}$/, { message: 'El dialCode debe comenzar con "+" seguido de 1 a 4 dígitos' })
    dialCode: string; // Ej: +57

    @IsNotEmpty()
    @Matches(/^[A-Z]{2}$/, { message: 'El countryCode debe ser un código ISO como CO o US' })
    countryCode: string; // Ej: CO

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    // @IsOptional()
    // @Matches(
    //     /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: 'The password must have a Uppercase, lowercase letter and a number'
    // })
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    verificationCode?: string;

    @IsNumber()
    @IsArray()
    @IsOptional()
    rolesId?: string[]
}
