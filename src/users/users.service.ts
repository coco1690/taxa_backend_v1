import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Country } from 'src/countries/entities/country.entity';
import { handleDbQuery, handleDbSave } from 'src/utils/handle-db-errors';
import { Role } from 'src/roles/entities/role.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}



  // 🤷‍♂️💡 Creo un Usuario

  async create(createUserDto: CreateUserDto ): Promise<User> {
    const { countryCode, rolesId=[],  ...rest } = createUserDto;

    const country = await handleDbQuery( // funcion manejador de errores DB para consultar en base de datos
      this.countryRepository.findOneBy({ countryCode }),
    );

    if (!country) {
      throw new BadRequestException('Código de país inválido');
    }

    if (country.dialCode !== rest.dialCode) {
      throw new BadRequestException(
        `El código de marcación (${rest.dialCode}) no coincide con el país ${country.name} (${country.dialCode})`,
      );
    }

    const rolesIds = rolesId

    if (!rolesId || rolesId.length === 0) {
      throw new BadRequestException('Debe proporcionar al menos un rol');
    }
      
    const roles = await handleDbQuery(
      this.roleRepository.findBy({ id: In(rolesIds)})
    )

   
    const user = this.userRepository.create({
      ...rest,
      country,
      
    });

    user.roles = roles
    user.isPhoneVerified = true // lo puedes cambiar si haces verificación real con Twilio en este momento esta forzado el valor true


    const savedUser = await handleDbSave(this.userRepository.save(user)); // funcion manejador de errores DB para guardar en base de datos
    return savedUser;
  }

  // 🤷‍♂️💡 Busco todos los usuarios

  async findAll(): Promise<User[]> {
    return await handleDbQuery(
      this.userRepository.find({ relations: ['roles','country'] }),
    );
  }
  
  // 🤷‍♂️💡 Busco un Usuario por id

  async findOne(id: number): Promise<User> {
    const user = await handleDbQuery(
      this.userRepository.findOne({ where: { id }, relations: ['roles','country'] }),
    );

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return user;
  }
}
