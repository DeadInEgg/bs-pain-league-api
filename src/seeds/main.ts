import { QueryRunner } from 'typeorm';
import { maps } from './map';
import { modes } from './mode';
import { modes_maps } from './modes_maps';
import { types } from './type';

export const populate = async (queryRunner: QueryRunner) => {
  types.forEach(async (type) => {
    await queryRunner.query(`INSERT INTO type (name) VALUES ("${type.name}")`);
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
};
