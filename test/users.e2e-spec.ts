import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { mainConfig } from '../src/main.config';
import { UpdatePasswordDto } from 'src/modules/users/dto/update-password.dto';
import dataSource from '../src/data-source';
import { populate } from '../src/seeds/main';

describe('Users', () => {
  let app: INestApplication;
  let jwt;
  let user;

  const createFirstUserParams: CreateUserDto = {
    mail: 'maxime@mail.fr',
    password: 'Password123!',
    username: 'DarkMaxime',
  };
  const createSecondUserParams: CreateUserDto = {
    mail: 'marius@mail.fr',
    password: 'Password456?',
    username: 'DarkMarius',
  };
  const updatePasswordParams: UpdatePasswordDto = {
    oldPassword: 'Password123!',
    newPassword: 'NewPassword123!',
    confirmNewPassword: 'NewPassword123!',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    mainConfig(app);

    await app.init();
    await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();
    await populate(queryRunner);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('POST /users', () => {
    it(`422 - ERROR : Password to weak`, async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...createFirstUserParams, password: 'toweak' });

      expect(response.status).toBe(422);
    });

    it(`422 - ERROR : Email not on correct format`, async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...createFirstUserParams, mail: 'notmail' });

      expect(response.status).toBe(422);
    });

    it(`201 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createFirstUserParams);

      expect(response.status).toBe(201);

      user = response.body;
    });

    it(`409 - ERROR : Email already exist`, async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createFirstUserParams);

      expect(response.status).toBe(409);
    });
  });

  describe('PATCH /users/me', () => {
    it(`401 - ERROR : Not authentificated`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .send({ mail: 'new@mail.fr' });

      expect(response.status).toBe(401);
    });

    it(`422 - ERROR : Email not on correct format`, async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          mail: createFirstUserParams.mail,
          password: createFirstUserParams.password,
        });

      jwt = authResponse.body.access_token;

      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + jwt)
        .send({ mail: 'notmail' });
      expect(response.status).toBe(422);
    });

    it(`409 - ERROR : Email already exist`, async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/users')
        .send(createSecondUserParams);

      user = createResponse.body;

      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + jwt)
        .send({ mail: createSecondUserParams.mail });

      expect(response.status).toBe(409);
    });

    it(`204 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + jwt)
        .send({ mail: 'new@mail.fr' });

      createFirstUserParams.mail = 'new@mail.fr';

      expect(response.status).toBe(204);
    });
  });

  describe('GET /users/me', () => {
    it(`401 - ERROR : Not authentificated`, async () => {
      const response = await request(app.getHttpServer()).get('/users/me');
      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS`, async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          mail: createSecondUserParams.mail,
          password: createSecondUserParams.password,
        });

      jwt = authResponse.body.access_token;

      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer ' + jwt);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining(user));
    });

    it(`404 - ERROR : User not found`, async () => {
      await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + jwt);
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer ' + jwt);
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /users/me/password', () => {
    it(`401 - ERROR : Not authentificated`, async () => {
      const response = await request(app.getHttpServer()).patch(
        '/users/me/password',
      );

      expect(response.status).toBe(401);
    });

    it(`422 - ERROR : Wrong old password`, async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          mail: createFirstUserParams.mail,
          password: createFirstUserParams.password,
        });

      jwt = authResponse.body.access_token;

      const response = await request(app.getHttpServer())
        .patch('/users/me/password')
        .send({ ...updatePasswordParams, oldPassword: 'wrong' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(422);
    });

    it(`422 - ERROR : New password to weak`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me/password')
        .send({ ...updatePasswordParams, newPassword: 'to weak' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(422);
    });

    it(`422 - ERROR : Not the same password`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me/password')
        .send({ ...updatePasswordParams, confirmNewPassword: 'NotTheSame123!' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(422);
    });

    it(`204 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me/password')
        .send(updatePasswordParams)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(204);

      createFirstUserParams.password = 'NewPassword123!';
    });
  });

  describe('DELETE /users/me', () => {
    it(`401 - ERROR : Not authentificated`, async () => {
      const response = await request(app.getHttpServer()).delete('/users/me');

      expect(response.status).toBe(401);
    });

    it(`204 - SUCCESS`, async () => {
      const authResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          mail: createFirstUserParams.mail,
          password: createFirstUserParams.password,
        });

      jwt = authResponse.body.access_token;

      const response = await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(204);
    });

    it(`404 - ERROR : User not found`, async () => {
      const response = await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(404);
    });
  });
});
