import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { handleDbQuery } from 'src/utils/handle-db-errors';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  
  async create(createRoleDto: CreateRoleDto) {

    const { id, ...rolData} = createRoleDto

    try{

      const newRol = this.roleRepository.create(createRoleDto);
      
      if( newRol.id === id ) throw new BadRequestException('db').message

  
      return this.roleRepository.save( newRol);
   


    } catch(error){
      this.handleDBErrors(error)
    }
  }


  async findByName(name: string): Promise<Role> {
    const role = await handleDbQuery(
      this.roleRepository.findOneBy({ name })
    )
    
    if (!role) {
      throw new NotFoundException(`Rol "${name}" no encontrado`);
    }
    return role;
  }

  //Metodo seed de roles 

  async onApplicationBootstrap() {
    const defaultRoles = ['ADMIN', 'AGENCY', 'DRIVER', 'CLIENT'];

    for (const name of defaultRoles) {
      const exists = await this.roleRepository.findOneBy({ name });
      if (!exists) {
        await this.roleRepository.save({ name });
        console.log(`✅ Rol insertado: ${name}`);
      }
    }
  }

   //############# MERTODOS PRIVADOS #############

   private handleDBErrors( error:any ): never { //never jamas deja regresar un valor ejm return: true
    if( error.code === '23505')
      throw new BadRequestException( error.detail );
    console.log( error );

    throw new InternalServerErrorException( ' please check server logs ')
    
  }
}
