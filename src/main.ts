import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { HttpDefautResponseMiddleware, HttpExceptionResponse } from './infra/middlewares'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new HttpExceptionResponse())
  app.useGlobalInterceptors(new HttpDefautResponseMiddleware())

  const config = new DocumentBuilder()
    .setTitle('Barbearia API')
    .setDescription('API de gereciamento do sistema para barbearias')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .setVersion('1.0')
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/', app, documentFactory)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
