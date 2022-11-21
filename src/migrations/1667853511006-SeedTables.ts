import { populate } from 'src/seeds/main';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTables1667853511006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await populate(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM maps_modes`);
    await queryRunner.query(`DELETE FROM mode`);
    await queryRunner.query(`DELETE FROM map`);
    await queryRunner.query(`DELETE FROM type`);
  }
}
