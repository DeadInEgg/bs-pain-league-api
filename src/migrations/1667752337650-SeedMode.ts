import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMode1667752337650 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'INSERT INTO mode (name, typeId) VALUES ("knockout", (SELECT id FROM type WHERE name = "3v3"))',
    );
    await queryRunner.query(
      'INSERT INTO mode (name, typeId) VALUES ("gemGrab", (SELECT id FROM type WHERE name = "3v3"))',
    );
    await queryRunner.query(
      'INSERT INTO mode (name, typeId) VALUES ("brawlBall", (SELECT id FROM type WHERE name = "3v3"))',
    );
    await queryRunner.query(
      'INSERT INTO mode (name, typeId) VALUES ("bounty", (SELECT id FROM type WHERE name = "3v3"))',
    );
    await queryRunner.query(
      'INSERT INTO mode (name, typeId) VALUES ("hotZone", (SELECT id FROM type WHERE name = "3v3"))',
    );
    await queryRunner.query(
      'INSERT INTO mode (name, typeId) VALUES ("duoShowdown", (SELECT id FROM type WHERE name = "duo"))',
    );
    await queryRunner.query(
      'INSERT INTO mode (name, typeId) VALUES ("soloShowdown", (SELECT id FROM type WHERE name = "solo"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM mode WHERE name = "knockout"');
    await queryRunner.query('DELETE FROM mode WHERE name = "gemGrab"');
    await queryRunner.query('DELETE FROM mode WHERE name = "brawlBall"');
    await queryRunner.query('DELETE FROM mode WHERE name = "bounty"');
    await queryRunner.query('DELETE FROM mode WHERE name = "hotZone"');
    await queryRunner.query('DELETE FROM mode WHERE name = "duoShowdown"');
    await queryRunner.query('DELETE FROM mode WHERE name = "soloShowdown"');
  }
}
