import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global Validation Pipe (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Loại bỏ fields không có trong DTO
      forbidNonWhitelisted: true,
      transform: true,         // Tự convert type (string → number, etc.)
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger UI
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('NextHR API')
      .setDescription('Enterprise Work & Performance Management System — API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('Auth', 'Xác thực & Phân quyền')
      .addTag('Projects', 'M01 - Quản lý dự án (BP001-005)')
      .addTag('Epics', 'M02 - Quản lý Epic (BP010)')
      .addTag('Work Items', 'M02 - Quản lý công việc (BP011-027)')
      .addTag('Progress', 'M03 - Theo dõi tiến độ (BP028)')
      .addTag('KPI (Skeleton - UNANALYZED)', 'M04 - Quản lý KPI (BP037-045)')
      .addTag('Violations (Skeleton - UNANALYZED)', 'M05 - Vi phạm & Chất lượng (BP046-051)')
      .addTag('Reports (Skeleton - UNANALYZED)', 'M06 - Báo cáo & Dashboard (BP052-060)')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    console.log(`📖 Swagger UI: http://localhost:${process.env.PORT || 3000}/api/docs`);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 NextHR API running on http://localhost:${port}/api/v1`);
}

bootstrap();
