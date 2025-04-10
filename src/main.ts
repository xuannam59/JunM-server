import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './configs/transform.interceptor';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);

  // Config CORS
  app.enableCors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    preflightContinue: false,
  });

  // ConfigService
  const configService = app.get(ConfigService);

  // Config TransformInterceptor
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  await app.listen(configService.get<string>("PORT") ?? 8000);
}
bootstrap();
