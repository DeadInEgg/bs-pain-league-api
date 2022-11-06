import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedType1667750077871 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('INSERT INTO type (name) VALUES ("solo")');
    await queryRunner.query('INSERT INTO type (name) VALUES ("duo")');
    await queryRunner.query('INSERT INTO type (name) VALUES ("3v3")');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM type WHERE name = "solo"');
    await queryRunner.query('DELETE FROM type WHERE name = "duo"');
    await queryRunner.query('DELETE FROM type WHERE name = "3v3"');
  }
}
