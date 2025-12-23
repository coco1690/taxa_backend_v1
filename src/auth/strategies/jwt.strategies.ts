
// import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { JwtPayload } from "../interface/jwt-payload.interface";
// import { User } from "src/users/entities/user.entity";
// import { envs } from "src/config/envs";


// // EN EL AUTH.MODULES IMPORTO Y EXPORTO EL JWTSTRATEGIE EN LOS PROVIDERS
// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {

//     constructor(
//         @InjectRepository( User )
//         private readonly userRepository : Repository<User>,

//     ){ 
//         super({
//             secretOrKey: envs.jwt_secret,
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
//         }); 
//     }

// // ESTE METODO SE VA LLAMAR SI EL JWT NO HA EXPIRADO Y SI LA FIRMA DEL JWT HACE MATCH CON EL PAYLOAD
//     async validate( payload: JwtPayload ): Promise<User> {

//         const { id, name } = payload
       
//         const user = await this.userRepository.findOneBy({ id, name })

//         if( !user )
//             throw new UnauthorizedException(' Token not valid ')
//         if( !user.isActive)
//             throw new UnauthorizedException(' User is inactive, talk with an admin ')
            
//         return user;
//     }
// }

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { envs } from 'src/config/envs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interface';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository( User )
    private readonly userRepository : Repository<User>,

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwt_secret
    });
  }

  async validate(payload: JwtPayload) {
    
    return { 
      id: payload.id, 
      name: payload.name,
      roles: payload.roles
    };
  }
}