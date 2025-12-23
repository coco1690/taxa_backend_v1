import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    id:string;

    @IsNotEmpty()
    @IsString()
    name:string;
}
