// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { RegisterAuthDto } from './dto/register-user.dto';




// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('register') // http://localhost:3000/api/v1/auth/register/
//   register(@Body() registerAuthDto: RegisterAuthDto) {
//     return this.authService.register(registerAuthDto);
//   }


// }


import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // 📲 Registro para CLIENTES (App Cliente)
  @Post('register-client')
  registerClient(@Body() dto: RegisterAuthDto) {
    return this.authService.registerClient(dto);
  }

  // 🚖 Registro para CONDUCTORES (App Conductor)
  @Post('register-driver')
  registerDriver(@Body() dto: RegisterAuthDto) {
    return this.authService.registerDriver(dto);
  }

  // 🟢 Enviar código SMS de verificación (Twilio o simulado)
  @Post('send-code')
  sendVerificationCode(@Body() dto: SendCodeDto) {
    return this.authService.sendVerificationCode(dto.phone);
  }

  @Post('login') 
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
}
