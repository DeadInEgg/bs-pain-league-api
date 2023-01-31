import { clean, populate, Table } from 'src/seeds/main';
import { MigrationInterface, QueryRunner } from 'typeorm';

const tables: Table[] = ['map', 'mode', 'type', 'user', 'tracker'];

export class SeedTables1667853511006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await populate(queryRunner, tables);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await clean(queryRunner, tables);
  }
}
