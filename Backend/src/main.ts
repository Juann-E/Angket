import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // WAJIB: Tambahkan ini agar NestJS tahu dia jalan di path /API milik cPanel
  app.setGlobalPrefix('API');
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
