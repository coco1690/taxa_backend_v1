import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Country } from 'src/countries/entities/country.entity';
import { handleDbQuery, handleDbSave } from 'src/utils/handle-db-errors';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}



  // 🤷‍♂️💡 Creo un Usuario

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { countryCode, ...rest } = createUserDto;

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

    const user = this.userRepository.create({
      ...rest,
      country,
    });

    const savedUser = await handleDbSave(this.userRepository.save(user)); // funcion manejador de errores DB para guardar en base de datos
    return savedUser;
  }

  // 🤷‍♂️💡 Busco todos los usuarios

  async findAll(): Promise<User[]> {
    return await handleDbQuery(
      this.userRepository.find({ relations: ['country'] }),
    );
  }
  
  // 🤷‍♂️💡 Busco un Usuario por id

  async findOne(id: number): Promise<User> {
    const user = await handleDbQuery(
      this.userRepository.findOne({ where: { id }, relations: ['country'] }),
    );

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    return user;
  }
}
