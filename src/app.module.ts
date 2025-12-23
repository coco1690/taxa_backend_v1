import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config/envs';
import { UsersModule } from './users/users.module';
import { CountriesModule } from './countries/countries.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';


@Module({
  imports: [

    TypeOrmModule.forRoot({
      type:     'postgres',
      host:     envs.db_host,
      port:     envs.db_port,
      database: envs.db_name,
      username: envs.db_username,
      password: envs.db_password,
      autoLoadEntities: true,
      synchronize: true
    }),

    UsersModule,

    CountriesModule,

    AuthModule,

    RolesModule,
  ],
  controllers: [],
  providers: [],
  
})
export class AppModule {}
