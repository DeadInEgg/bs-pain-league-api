import { QueryRunner } from 'typeorm';
import { maps } from './map';
import { modes } from './mode';
import { trackers } from './tracker';
import { types } from './type';
import { users } from './user';
import { brawlers } from './brawler';
import * as bcrypt from 'bcrypt';

export type Table = 'type' | 'mode' | 'map' | 'user' | 'tracker' | 'brawler';

export const populate = async (
  queryRunner: QueryRunner,
  tables: Table[] = ['map', 'mode', 'type', 'brawler'],
): Promise<void> => {
  if (tables.includes('type')) {
    for (const type of types) {
      await queryRunner.query(
        `INSERT INTO type (name) VALUES ("${type.name}")`,
      );
    }
  }

  if (tables.includes('mode')) {
    for (const mode of modes) {
      await queryRunner.query(
        `INSERT INTO mode (name, image, isActive, type_id) VALUES ("${
          mode.name
        }", "${
          mode.image
        }", ${!!mode.isActive}, (SELECT id FROM type WHERE name = "${
          mode.type
        }"))`,
      );
    }
  }

  if (tables.includes('map')) {
    for (const map of maps) {
      await queryRunner.query(
        `INSERT INTO map (name, image, isActive, isOnPowerLeagueSeason, mode_id) VALUES ("${
          map.name
        }", "${
          map.image
        }", ${!!map.isActive}, ${!!map.isOnPowerLeagueSeason}, (SELECT id FROM mode WHERE name = "${
          map.mode
        }"))`,
      );
    }
  }

  if (tables.includes('user')) {
    for (const user of users) {
      await queryRunner.query(
        `INSERT INTO user (username, mail, password) VALUES ("${
          user.username
        }", "${user.mail}", "${bcrypt.hashSync(user.password, 10)}")`,
      );
    }
  }

  if (tables.includes('tracker')) {
    for (const tracker of trackers) {
      await queryRunner.query(
        `INSERT INTO tracker (name, ${
          tracker.tag ? 'tag,' : ''
        } hash, user_id) VALUES ("${tracker.name}", ${
          tracker.tag ? '"' + tracker.tag + '",' : ''
        } "${tracker.hash}", (SELECT id FROM user WHERE username = "${
          tracker.user
        }"))`,
      );
    }
  }

  if (tables.includes('brawler')) {
    for (const brawler of brawlers) {
      await queryRunner.query(
        `INSERT INTO brawler (name, image) VALUES ("${brawler.name}", "${brawler.image}")`,
      );
    }
  }
};

export const clean = async (
  queryRunner: QueryRunner,
  tables: Table[],
): Promise<void> => {
  for (const table of tables) {
    await queryRunner.query(`DELETE FROM ${table}`);
  }
};
