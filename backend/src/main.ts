import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for Angular frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // Global exception filter for error handling
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global response interceptor for standardizing responses
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Full-Stack Monorepo Starter API')
    .setDescription(
      'Full-Stack Monorepo Starter API - Production-ready NestJS application with Prisma, Redis, and PostgreSQL',
    )
    .setVersion('1.0')
    .addTag('tasks', 'Task management endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  setTimeout(() => {
    console.log(
      `\x1b[34m📚 Swagger docs at: http://localhost:${port}/api\x1b[0m`,
    );
    console.log(`\x1b[34m🚀 Server live at:  http://localhost:${port}\x1b[0m`);
  }, 10);
}
bootstrap();
