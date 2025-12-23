import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Country } from 'src/countries/entities/country.entity';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([ User, Country, Role ]) ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule], // Exportar si otros módulos lo van a usar
})
export class UsersModule {}
