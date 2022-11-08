import { maps } from 'src/seeds/map';
import { modes } from 'src/seeds/mode';
import { modes_maps } from 'src/seeds/modes_maps';
import { types } from 'src/seeds/type';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTables1667853511006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    types.forEach(async (type) => {
      await queryRunner.query(
        `INSERT INTO type (name) VALUES ("${type.name}")`,
      );
    });

    modes.forEach(async (mode) => {
      await queryRunner.query(
        `INSERT INTO mode (name, type_id) VALUES ("${mode.name}", (SELECT id FROM type WHERE name = "${mode.type}"))`,
      );
    });

    maps.forEach(async (map) => {
      await queryRunner.query(`INSERT INTO map (name) VALUES ("${map.name}")`);
    });

    modes_maps.forEach(async (mode_map) => {
      await queryRunner.query(
        `INSERT INTO maps_modes (map_id, mode_id) VALUES ((SELECT id FROM map WHERE name = "${mode_map.name}"), (SELECT id FROM mode WHERE name = "${mode_map.mode}"))`,
      );
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM maps_modes`);
    await queryRunner.query(`DELETE FROM mode`);
    await queryRunner.query(`DELETE FROM map`);
    await queryRunner.query(`DELETE FROM type`);
  }
}
