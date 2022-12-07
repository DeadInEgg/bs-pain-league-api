import { INestApplication } from '@nestjs/common';
import { users } from '../src/seeds/user';
import * as request from 'supertest';

export const connectUser = async (
  app: INestApplication,
  mail = users[0].mail,
  password = users[0].password,
) => {
  const authResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      mail,
      password,
    });

  return authResponse.body.access_token;
};
