import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { mainConfig } from '../src/main.config';
import dataSource from '../src/data-source';
import { populate } from '../src/seeds/main';
import { connectUser } from './utils';
import { URLSearchParams } from 'url';
import { modes } from '../src/seeds/mode';

describe('Modes', () => {
  let app: INestApplication;
  let jwt;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    mainConfig(app);

    await app.init();
    await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();
    await populate(queryRunner, ['user', 'mode', 'type']);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('GET /modes', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer()).get('/modes');

      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS : All modes`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/modes')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(modes.length);
    });

    it(`200 - SUCCESS : Actives modes`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/modes?isActive=true')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        modes.filter((mode) => mode.isActive).length,
      );
    });

    it(`200 - SUCCESS : Not actives modes`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/modes?isActive=false')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        modes.filter((mode) => !mode.isActive).length,
      );
    });

    it(`200 - SUCCESS : Not correct query params isActive so all modes`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/modes?isActive=blblblbl')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(modes.length);
    });

    it(`200 - SUCCESS : With correct type params`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get(`/modes?` + new URLSearchParams({ type: '3v3' }))
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        modes.filter((mode) => mode.type === '3v3').length,
      );
    });

    it(`200 - SUCCESS : Not correct query params mode so no modes`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/modes?type=blblblbl')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    it(`200 - SUCCESS : With a correct type and isActive`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get(
          `/modes?${new URLSearchParams({
            type: '3v3',
            isActive: 'true',
          })}`,
        )
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        modes
          .filter((mode) => mode.type === '3v3')
          .filter((mode) => mode.isActive).length,
      );
    });
  });
});
