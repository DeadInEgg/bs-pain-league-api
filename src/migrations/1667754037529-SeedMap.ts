import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedMap1667754037529 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('INSERT INTO map (name) VALUES ("Super Beach")');
    await queryRunner.query('INSERT INTO map (name) VALUES ("Hard Rock Mine")');
    await queryRunner.query(
      'INSERT INTO map (name) VALUES ("Out in the Open")',
    );
    await queryRunner.query(
      'INSERT INTO map (name) VALUES ("Dueling Beetles")',
    );
    await queryRunner.query('INSERT INTO map (name) VALUES ("Skull Creek")');
    await queryRunner.query('INSERT INTO map (name) VALUES ("Beach Ball")');
    await queryRunner.query('INSERT INTO map (name) VALUES ("Belle`s Rock")');
    await queryRunner.query(
      'INSERT INTO map (name) VALUES ("Purple Paradise")',
    );
    await queryRunner.query(
      'INSERT INTO map (name) VALUES ("Feast or Famine")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM map WHERE name = "Super Beach"');
    await queryRunner.query('DELETE FROM map WHERE name = "Hard Rock Mine"');
    await queryRunner.query('DELETE FROM map WHERE name = "Out in the Open"');
    await queryRunner.query('DELETE FROM map WHERE name = "Dueling Beetles"');
    await queryRunner.query('DELETE FROM map WHERE name = "Skull Creek"');
    await queryRunner.query('DELETE FROM map WHERE name = "Beach Ball"');
    await queryRunner.query('DELETE FROM map WHERE name = "Belle`s Rock"');
    await queryRunner.query('DELETE FROM map WHERE name = "Purple Paradise"');
    await queryRunner.query('DELETE FROM map WHERE name = "Feast or Famine"');
  }
}
