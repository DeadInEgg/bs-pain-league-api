import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { mainConfig } from '../src/main.config';
import { CreateTrackerDto } from 'src/modules/trackers/dto/create-tracker.dto';
import dataSource from '../src/data-source';
import { populate } from '../src/seeds/main';
import { connectUser } from './utils';
import { users } from '../src/seeds/user';
import { trackers } from '../src/seeds/tracker';

describe('Trackers', () => {
  let app: INestApplication;
  let jwt;
  let hash;

  const createTrackerDto: CreateTrackerDto = {
    name: 'Super Tracker',
    tag: 'tagcode123',
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
    await populate(queryRunner, ['user', 'tracker']);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('POST /trackers', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer())
        .post('/trackers')
        .send(createTrackerDto);

      expect(response.status).toBe(401);
    });

    it(`201 - SUCCESS`, async () => {
      jwt = await connectUser(app, users[1].mail, users[1].password);

      const response = await request(app.getHttpServer())
        .post('/trackers')
        .set('Authorization', 'Bearer ' + jwt)
        .send(createTrackerDto);

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
        .send(createTrackerDto);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /trackers', () => {
    it(`401 - ERROR : User not authenticated`, async () => {
      const response = await request(app.getHttpServer()).get('/trackers');

      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/trackers')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        trackers.filter((tracker) => tracker.user === users[0].username).length,
      );

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

    it(`204 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/trackers/${hash}`)
        .send({ name: 'updated !' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(204);
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
});
