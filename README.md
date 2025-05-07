<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Taxa api 

1.Levantar la base de datos.
```
docker-compose up -d
```
2.Instalo el paquete de TypeORM para utilizar DB Postgres.
´´´
npm install @nestjs/typeorm typeorm pg
´´´
3.Conecto la base de datos postgres a tablePlus.

4.Estos 2 paquetes se deben instalar para config/envs.ts 
´´´
npm install dotenv
npm install joi
´´´
5.Para configurar los entitys y DTO se instala los siguientes paquetes.
´´´
npm i class-validator class-transformer
´´ 

