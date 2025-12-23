import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendCodeDto {
  @IsNotEmpty()
  phone: string;
}
