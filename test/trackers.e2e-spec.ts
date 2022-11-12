import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { mainConfig } from '../src/main.config';
import { CreateTrackerDto } from 'src/modules/trackers/dto/create-tracker.dto';

describe('Users', () => {
  let app: INestApplication;
  let jwt;
  let hash;

  const createFirstUserParams: CreateUserDto = {
    mail: 'singe@mail.fr',
    password: 'Password789!',
    username: 'DarkBolnoix',
  };

  const createFirstTrackerParams: CreateTrackerDto = {
    name: 'Super Tracker',
    tag: 'tagcode123',
  };

  const createSecondTrackerParams: CreateTrackerDto = {
    name: 'Mega Super Tracker',
    tag: 'tagcode456',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    mainConfig(app);

    await app.init();
  });

  describe('POST /trackers', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer())
        .post('/trackers')
        .send(createFirstTrackerParams);

      expect(response.status).toBe(401);
    });

    it(`201 - SUCCESS`, async () => {
      await createUserAndLogin();

      const response = await request(app.getHttpServer())
        .post('/trackers')
        .set('Authorization', 'Bearer ' + jwt)
        .send(createFirstTrackerParams);

      expect(response.status).toBe(201);
    });

    it(`422 - ERROR : Params not correct`, async () => {
      const response = await request(app.getHttpServer())
        .post('/trackers')
        .set('Authorization', 'Bearer ' + jwt)
        .send();

      expect(response.status).toBe(422);
    });

    it(`401 - ERROR : User not found`, async () => {
      await request(app.getHttpServer())
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + jwt);

      const response = await request(app.getHttpServer())
        .post('/trackers')
        .set('Authorization', 'Bearer ' + jwt)
        .send(createFirstTrackerParams);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /trackers', () => {
    it(`401 - ERROR : User not authenticated`, async () => {
      const response = await request(app.getHttpServer()).get('/trackers');

      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS`, async () => {
      await createUserAndLogin();

      await createTrackers([
        createFirstTrackerParams,
        createSecondTrackerParams,
      ]);

      const response = await request(app.getHttpServer())
        .get('/trackers')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);

      hash = response.body[0].hash;
    });
  });

  describe('GET /trackers/:hash', () => {
    it(`401 - ERROR : User not authenticated`, async () => {
      const response = await request(app.getHttpServer()).get('/trackers/');

      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/trackers/${hash}`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
    });

    it(`404 - ERROR : Tracker not found`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/trackers/fakehash`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /trackers/:hash', () => {
    it(`401 - ERROR : User not authenticated`, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/trackers/${hash}`)
        .send({ name: 'updated ?' });

      expect(response.status).toBe(401);
    });

    it(`422 - ERROR : DTO not correct`, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/trackers/${hash}`)
        .send({ name: 'abc' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(422);
    });

    it(`200 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/trackers/${hash}`)
        .send({ name: 'updated !' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
    });

    it(`404 - ERROR : Tracker not found`, async () => {
      const response = await request(app.getHttpServer())
        .patch('/trackers/fakehash')
        .send({ name: 'updated again ?' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /trackers/:hash', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer()).delete(
        `/trackers/${hash}`,
      );

      expect(response.status).toBe(401);
    });

    it(`404 - ERROR : Tracker not found`, async () => {
      const response = await request(app.getHttpServer())
        .delete('/trackers/fakehash')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(404);
    });

    it(`204 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/trackers/${hash}`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(204);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  const createUserAndLogin = async () => {
    await request(app.getHttpServer())
      .post('/users')
      .send(createFirstUserParams);

    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        mail: createFirstUserParams.mail,
        password: createFirstUserParams.password,
      });

    jwt = authResponse.body.access_token;
  };

  const createTrackers = async (trackersDto: CreateTrackerDto[]) => {
    await Promise.all(
      trackersDto.map(async (tracker) => {
        await request(app.getHttpServer())
          .post('/trackers')
          .send(tracker)
          .set('Authorization', 'Bearer ' + jwt);
      }),
    );
  };
});
