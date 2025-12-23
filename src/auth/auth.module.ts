import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { JwtStrategy } from './strategies/jwt.strategies';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/entities/role.entity';
import { UsersModule } from 'src/users/users.module';


@Module({

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesService],
  imports:[ 

    TypeOrmModule.forFeature( [ User, Role] ),

    UsersModule,
    
    //INICIALIZO EL PASSPORT PARA EL JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),

    //CONFIGURO EL JWT 
    JwtModule.registerAsync({
      imports: [],
      inject:  [],
      useFactory: () => {
        return{
          secret: envs.jwt_secret,
          signOptions: { expiresIn: '1d' },
        }
      }
    })
  ],
  exports:[ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
