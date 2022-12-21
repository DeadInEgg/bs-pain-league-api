import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { mainConfig } from '../src/main.config';
import dataSource from '../src/data-source';
import { populate } from '../src/seeds/main';
import { GameResult } from '../src/modules/games/entities/game.entity';
import { CreateGameDto } from '../src/modules/games/dto/create-game.dto';
import { UpdateGameDto } from '../src/modules/games/dto/update-game.dto';
import { connectUser } from './utils';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { trackers } from '../src/seeds/tracker';

describe('Games', () => {
  let app: INestApplication;
  let jwt;
  let gameId;

  const result = {
    data: {
      items: [
        {
          event: {
            mode: 'knockout',
            map: 'Out in the Open',
          },
          battle: {
            result: 'victory',
          },
        },
        {
          event: {
            mode: 'brawlball',
            map: 'Super Beach',
          },
          battle: {
            result: 'defeat',
          },
        },
      ],
    },
  };

  const httpService = { get: () => of(result) };

  const createFirstGameParams: CreateGameDto = {
    mapId: 1,
    modeId: 1,
    result: GameResult.DEFEAT,
    trackerHash: 'hash123',
  };

  const updateFirstGameParams: UpdateGameDto = {
    mapId: 2,
    modeId: 2,
    result: GameResult.VICTORY,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue(httpService)
      .compile();

    app = moduleRef.createNestApplication();

    mainConfig(app);

    await app.init();
    await dataSource.initialize();
    const queryRunner = dataSource.createQueryRunner();
    await populate(queryRunner, [
      'map',
      'maps_modes',
      'mode',
      'tracker',
      'type',
      'user',
    ]);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('POST /games', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer())
        .post('/games')
        .send(createFirstGameParams);

      expect(response.status).toBe(401);
    });

    it(`201 - SUCCESS`, async () => {
      jwt = await connectUser(app);

      const response = await request(app.getHttpServer())
        .post('/games')
        .set('Authorization', 'Bearer ' + jwt)
        .send(createFirstGameParams);

      expect(response.status).toBe(201);

      gameId = response.body.id;
    });

    it(`422 - ERROR : Params not correct`, async () => {
      const response = await request(app.getHttpServer())
        .post('/games')
        .set('Authorization', 'Bearer ' + jwt)
        .send();

      expect(response.status).toBe(422);
    });

    it(`404 - ERROR : Hash not found`, async () => {
      const response = await request(app.getHttpServer())
        .post('/games')
        .set('Authorization', 'Bearer ' + jwt)
        .send({ ...createFirstGameParams, trackerHash: 'incorrectHash' });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /games/:id', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer()).get(
        `/games/${gameId}`,
      );

      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/games/${gameId}`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
    });

    it(`400 - ERROR - Not correct type for id`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/games/stringId`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(400);
    });

    it(`404 - ERROR - Game not found`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/games/999`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /games/:id', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer()).patch(
        `/games/${gameId}`,
      );

      expect(response.status).toBe(401);
    });

    it(`400 - ERROR : Query param not correct`, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/games/stringId`)
        .send(updateFirstGameParams)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(400);
    });

    it(`422 - ERROR : `, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/games/${gameId}`)
        .send({ incorrectParams: 'wtf bro' })
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(422);
    });

    it(`200 - SUCCESS : `, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/games/${gameId}`)
        .send(updateFirstGameParams)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(204);
    });
  });

  describe('DELETE /games/:id', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer()).delete(
        `/games/${gameId}`,
      );

      expect(response.status).toBe(401);
    });

    it(`400 - ERROR : Query param not correct`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/games/stringId`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(400);
    });

    it(`404 - ERROR : Game not found`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/games/999`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(404);
    });

    it(`204 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/games/${gameId}`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(204);
    });
  });

  describe('GET /games/suggest/:trackerHash', () => {
    it(`401 - ERROR : Not authenticated`, async () => {
      const response = await request(app.getHttpServer()).get(
        `/games/suggest/${trackers[0].hash}`,
      );

      expect(response.status).toBe(401);
    });

    it(`200 - SUCCESS`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/games/suggest/${trackers[0].hash}`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(200);
    });

    it(`422 - ERROR : Tag not found`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/games/suggest/${trackers[1].hash}`)
        .set('Authorization', 'Bearer ' + jwt);

      expect(response.status).toBe(422);
    });
  });
});
