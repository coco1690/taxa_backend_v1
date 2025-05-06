import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';


async function bootstrap() {

  const logger = new Logger('Main')

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    })
    );
  
  
  await app.listen(envs.port);
  logger.log(`App corriendo en el puerto ${ envs.port }`)

//   await app.listen(envs.port, '10.0.2.2', () => {
//     logger.log(`App corriendo en el puerto ${ envs.port }`)
// });
}

bootstrap();
