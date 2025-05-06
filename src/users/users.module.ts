import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Country } from 'src/countries/entities/country.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([ User, Country ]) ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportar si otros módulos lo van a usar
})
export class UsersModule {}
