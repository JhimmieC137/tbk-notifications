import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { Transport } from '@nestjs/microservices';
import { baseConfig } from './settings/base.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [baseConfig().rabbit_url],
      queue: 'notification_queue'
    }
  })
  

  const apiDocsConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Travel Booking Platform - Notifications')
  .setDescription('All endpoints for the platform\'s user notifications')
  .setVersion('1.0')
  .addTag('Notification')
  .build();

  const apiDocs = SwaggerModule.createDocument(app, apiDocsConfig, {
    include: [NotificationsModule],
  });

  SwaggerModule.setup('docs', app, apiDocs);

  app.useGlobalPipes(new ValidationPipe());
  const port = app.get(ConfigService).get<number>('PORT', 3100);
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
