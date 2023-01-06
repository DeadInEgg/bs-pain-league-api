import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { mainConfig } from '../src/main.config';
import dataSource from '../src/data-source';
import { populate } from '../src/seeds/main';
import { connectUser } from './utils';
import { maps } from '../src/seeds/map';

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
      const response = await request(app.getHttpServer()).get('/brawlers');

      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .get('/maps')
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(maps.length);
    });
  });
});
