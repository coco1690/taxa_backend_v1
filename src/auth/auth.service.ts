import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt' //yarn add -D @types/bcrypt

import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from './interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/entities/role.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { handleDbQuery, handleDbSave } from 'src/utils/handle-db-errors';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { Twilio } from 'twilio';
import { envs } from 'src/config/envs';
import { LoginAuthDto } from './dto/login-auth.dto';

const twilioClient = new Twilio(
  envs.twilio_account_sid!,
  envs.twilio_auth_token!,
);


@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User) private readonly userRepositiry: Repository<User>,
    @InjectRepository(Role) private readonly rolRepositiry: Repository<Role>,

    // INYECTO EL SERVICIO PARA GENERAR EL JWT EN EL METODO GETJWTOKEN
    private readonly jwtService: JwtService
  ) { }

  // ################ REGISTRO EL USUARIO #####################

  async register(registerAuthDto: RegisterAuthDto) {


    const { password, rolesId, ...rest } = registerAuthDto;

    const newUser = this.userRepositiry.create({
      ...rest,
      password: bcrypt.hashSync(password, 10) // ENCRIPTO LA CONTRASEÑA
    });

    let rolesIds: (number | string)[] = [];

    if (rolesId && rolesId.length > 0) {
      rolesIds = rolesId;
    } else {
      const defaultRole = await handleDbQuery(
        this.rolRepositiry.findOneBy({ name: 'CLIENT' })
      )
      if (!defaultRole) throw new BadRequestException('Rol CLIENT no encontrado');
      rolesIds.push(defaultRole.id);
    }

    const roles = await handleDbQuery(
      this.rolRepositiry.findBy({ id: In(rolesIds) })
    )
    newUser.roles = roles

    const userSaved = await handleDbSave(
      this.userRepositiry.save(newUser)
    )
    const rolIds = newUser.roles.map(r => r.id);
    const { password: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      token: this.getJwToken({
        id: userSaved.id,
        name: userSaved.fullName,
        roles: rolIds
      }),
    };
  }


  // ################ LOGIN DE USUARIO ########################

  async login(loginAuthDto: LoginAuthDto) {
    const { password, email, phone } = loginAuthDto;

    if (!email && !phone)
      throw new BadRequestException('Debe proporcionar email o teléfono');


    const queryBuilder = this.userRepositiry
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'roles');

    if (email) {
      queryBuilder.where('user.email = :email', { email });
    } else {
      queryBuilder.where('user.phone = :phone', { phone });
    }

    const user = await handleDbQuery(queryBuilder.getOne());

    if (!user)
      throw new UnauthorizedException('Credenciales no válidas');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales no válidas');

    const rolesIds = user.roles.map(rol => rol.id);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: this.getJwToken({ id: user.id, name: user.fullName, roles: rolesIds })
    };
  }



  // 📲 Registro para CLIENTES (App Cliente)

  async registerClient(dto: RegisterAuthDto) {
    const clientRole = await handleDbQuery(
      this.rolRepositiry.findOneBy({ name: 'CLIENT' }),
    );
    if (!clientRole) throw new BadRequestException('Rol CLIENT no encontrado');

    // Inyectamos el rol directamente en rolesId
    return this.register({ ...dto, rolesId: [clientRole.id] });
  }

  // 🚖 Registro para CONDUCTORES (App Conductor)

  async registerDriver(dto: RegisterAuthDto) {
    const driverRole = await handleDbQuery(
      this.rolRepositiry.findOneBy({ name: 'DRIVER' }),
    );
    if (!driverRole) throw new BadRequestException('Rol DRIVER no encontrado');

    return this.register({ ...dto, rolesId: [driverRole.id] });
  }


  // ✅ Registro genérico con verificación y rol

 private async registerWithRole(dto: RegisterAuthDto) {
  if (!dto.verificationCode) {
    throw new BadRequestException('El código de verificación es requerido');
  }

  const isVerified = await this.verifyCode(dto.phone, dto.verificationCode);
  if (!isVerified) {
    throw new UnauthorizedException('Código de verificación inválido');
  }

  const { verificationCode, ...userData } = dto;

  const user = await handleDbQuery(
    this.usersService.create(userData),
  );

  const token = await this.jwtService.signAsync({ sub: user.id });

  return {
    token,
    user,
  };
}


  // ✅ Enviar código SMS (Twilio o simulado)

  async sendVerificationCode(phone: string) {
    const useTwilio = envs.use_twilio_verify === 'true';

    if (!useTwilio) {
      return {
        message: 'Modo desarrollo: Código simulado es 123456',
      };
    }

    try {
      const result = await twilioClient.verify.v2
        .services(envs.twilio_account_sid!)
        .verifications.create({
          to: phone,
          channel: 'sms',
        });

      return {
        message: 'Código enviado por SMS',
        sid: result.sid,
      };
    } catch (error) {
      console.error('Twilio error:', error.message);
      throw new BadRequestException('No se pudo enviar el código SMS');
    }
  }

  // ✅ Verificar código ingresado

  private async verifyCode(phone: string, code: string): Promise<boolean> {
    const useTwilio = envs.use_twilio_verify === 'true';

    if (!useTwilio) {
      return code === '123456'; // modo desarrollo
    }

    try {
      const result = await twilioClient.verify.v2
        .services(envs.twilio_account_sid!)
        .verificationChecks.create({
          to: phone,
          code,
        });

      return result.status === 'approved';
    } catch (error) {
      console.error('Error verificando código con Twilio:', error.message);
      return false;
    }
  }




  // ################   METODOS PRIVADOS  #####################


  private getJwToken(payload: JwtPayload) {

    //GENERO EL TOKEN
    const token = this.jwtService.sign(payload)
    return 'Bearer ' + token;
  }

}
