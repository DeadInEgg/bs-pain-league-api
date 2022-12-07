import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { mainConfig } from '../src/main.config';
import { UpdatePasswordDto } from 'src/modules/users/dto/update-password.dto';
import dataSource from '../src/data-source';
import { populate } from '../src/seeds/main';
import { connectUser } from './utils';
import { users } from '../src/seeds/user';

describe('Users', () => {
  let app: INestApplication;
  let jwt;

  const createUserDto: CreateUserDto = {
    mail: 'new.user@mail.fr',
    password: 'Password999!',
    username: 'NewUser',
  };
  const updatePasswordDto: UpdatePasswordDto = {
    oldPassword: createUserDto.password,
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
    await populate(queryRunner, ['user']);
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
        .send({ ...createUserDto, password: 'toweak' });

      expect(response.status).toBe(422);
    });

    it(`422 - ERROR : Email not on correct format`, async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ ...createUserDto, mail: 'notmail' });

      expect(response.status).toBe(422);
    });

    it(`201 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

      expect(response.status).toBe(201);
    });

    it(`409 - ERROR : Email already exist`, async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto);

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
      jwt = await connectUser(app, createUserDto.mail, createUserDto.password);

      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + jwt)
        .send({ mail: 'notmail' });

      expect(response.status).toBe(422);
    });

    it(`409 - ERROR : Email already exist`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + jwt)
        .send({ mail: users[0].mail });

      expect(response.status).toBe(409);
    });

    it(`204 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + jwt)
        .send({ mail: 'new@mail.fr' });

      createUserDto.mail = 'new@mail.fr';

      expect(response.status).toBe(204);
    });
  });

  describe('GET /users/me', () => {
    it(`401 - ERROR : Not authentificated`, async () => {
      const response = await request(app.getHttpServer()).get('/users/me');

      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.mail).toBe(users[0].mail);
      expect(response.body.username).toBe(users[0].username);
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
      jwt = await connectUser(app, createUserDto.mail, createUserDto.password);

      const response = await request(app.getHttpServer())
        .patch('/users/me/password')
        .send({ ...updatePasswordDto, oldPassword: 'wrong' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(422);
    });

    it(`422 - ERROR : New password to weak`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me/password')
        .send({ ...updatePasswordDto, newPassword: 'to weak' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(422);
    });

    it(`422 - ERROR : Not the same password`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me/password')
        .send({ ...updatePasswordDto, confirmNewPassword: 'NotTheSame123!' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(422);
    });

    it(`204 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me/password')
        .send(updatePasswordDto)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(204);

      createUserDto.password = 'NewPassword123!';
    });
  });

  describe('DELETE /users/me', () => {
    it(`401 - ERROR : Not authentificated`, async () => {
      const response = await request(app.getHttpServer()).delete('/users/me');

      expect(response.status).toBe(401);
    });

    it(`204 - SUCCESS`, async () => {
      jwt = await connectUser(app, createUserDto.mail, createUserDto.password);

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
