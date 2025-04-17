import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './configs/transform.interceptor';
import { VersioningType } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const reflector = app.get(Reflector);

  // ConfigService
  const configService = app.get(ConfigService);

  // Config CORS
  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    preflightContinue: false,
  });

  // use cookieParser
  app.use(cookieParser());

  // Config ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Config prefix version
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
  });

  // Config TransformInterceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // Config JWT
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(configService.get<string>("PORT") ?? 8000);
}
bootstrap();
