import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // CORS pour le développement local et production
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://ai4local.mg', 'https://app.ai4local.mg']
      : ['http://localhost:3000', 'http://localhost:19006'], // Web + Expo
    credentials: true,
  });

  // Configuration du port
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 4000;

  await app.listen(port);
  console.log(`🚀 API Gateway started on http://localhost:${port}/graphql`);
}

bootstrap();