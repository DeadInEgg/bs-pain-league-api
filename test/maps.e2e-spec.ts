import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { mainConfig } from '../src/main.config';
import dataSource from '../src/data-source';
import { populate } from '../src/seeds/main';
import { connectUser } from './utils';
import { maps } from '../src/seeds/map';
import { URLSearchParams } from 'url';

describe('Maps', () => {
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
    await populate(queryRunner, ['user', 'map', 'mode']);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('GET /maps', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer()).get('/maps');

      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS : All maps`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/maps')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(maps.length);
    });

    it(`200 - SUCCESS : Actives maps`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/maps?isActive=true')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        maps.filter((map) => map.isActive).length,
      );
    });

    it(`200 - SUCCESS : Not actives maps`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/maps?isActive=false')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        maps.filter((map) => !map.isActive).length,
      );
    });

    it(`200 - SUCCESS : Not correct query params isActive so all maps`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/maps?isActive=blblblbl')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(maps.length);
    });

    it(`200 - SUCCESS : On Power League season maps`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/maps?isOnPowerLeagueSeason=true')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        maps.filter((map) => map.isOnPowerLeagueSeason).length,
      );
    });

    it(`200 - SUCCESS : Not on Power League season maps`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/maps?isOnPowerLeagueSeason=false')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        maps.filter((map) => !map.isOnPowerLeagueSeason).length,
      );
    });

    it(`200 - SUCCESS : Not correct query params isOnPowerLeagueSeason so all maps`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/maps?isOnPowerLeagueSeason=blblblbl')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(maps.length);
    });

    it(`200 - SUCCESS : With correct mode params`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get(`/maps?` + new URLSearchParams({ mode: 'Gem Grab' }))
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        maps.filter((map) => map.mode === 'Gem Grab').length,
      );
    });

    it(`200 - SUCCESS : Not correct query params mode so no maps`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/maps?mode=blblblbl')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(0);
    });

    it(`200 - SUCCESS : With a correct mode and isActive`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get(
          `/maps?${new URLSearchParams({
            mode: 'Gem Grab',
            isActive: 'true',
          })}`,
        )
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(
        maps
          .filter((map) => map.mode === 'Gem Grab')
          .filter((map) => map.isActive).length,
      );
    });
  });
});
