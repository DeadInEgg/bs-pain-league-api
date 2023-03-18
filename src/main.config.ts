import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';

export function mainConfig(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
}
