import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/countries/entities/country.entity';

import { Repository } from 'typeorm';

@Injectable()
export class CountrySeeder implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async onApplicationBootstrap() {
    const countries = [
      { countryCode: 'CO', name: 'Colombia', dialCode: '+57' },
      { countryCode: 'US', name: 'Estados Unidos', dialCode: '+1' },
      { countryCode: 'MX', name: 'México', dialCode: '+52' },
      { countryCode: 'AR', name: 'Argentina', dialCode: '+54' },
      { countryCode: 'BR', name: 'Brasil', dialCode: '+55' },
      { countryCode: 'PE', name: 'Perú', dialCode: '+51' },
      { countryCode: 'CL', name: 'Chile', dialCode: '+56' },
      { countryCode: 'VE', name: 'Venezuela', dialCode: '+58' },
    ];

    for (const country of countries) {
      const exists = await this.countryRepository.findOneBy({ countryCode: country.countryCode });
      if (!exists) {
        await this.countryRepository.save(country);
        console.log(`✅ País insertado: ${country.name}`);  
      }
    }
  }
}
