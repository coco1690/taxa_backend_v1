import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { CountrySeeder } from 'src/seeds/country.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountrySeeder],
})
export class CountriesModule {}
