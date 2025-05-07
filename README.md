<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Taxa api 

0.para correr el servidor se utiliza el sieguiente comando
 ```
 npm run start:dev
 ```
1.creo el archivo docker-compose.yml, en el inserto el siguiente codigo, ya viene configurado el postgres y postgis para datos espaciales
```
services:
  db:
    image: postgis/postgis:14-3.3
    container_name: taxaAppDB
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - ./postgres:/var/lib/postgresql/data

```
2.Levantar la base de datos.
```
docker-compose up -d
```
3.Instalo el paquete de TypeORM para utilizar DB Postgres.
```
npm install @nestjs/typeorm typeorm pg
```
4.Conecto la base de datos postgres a tablePlus.

5.Estos 2 paquetes se deben instalar para config/envs.ts 
```
npm install dotenv
npm install joi
```
6.Para configurar los entitys y DTO se instala los siguientes paquetes.
```
npm i class-validator class-transformer
```
7.En el main.ts configuro los pipes globales y el setGloblalPrefix
```
app.setGlobalPrefix('api/v1')

app.useGlobalPipes(
 new ValidationPipe({
 whitelist: true,
 forbidNonWhitelisted: true,
 })
);
```

