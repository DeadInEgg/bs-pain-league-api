import { MigrationInterface, QueryRunner } from 'typeorm';
import { populate } from '../seeds/main';

export class SeedBrawlers1669569486739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await populate(queryRunner, ['brawler']);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM brawler`);
  }
}
