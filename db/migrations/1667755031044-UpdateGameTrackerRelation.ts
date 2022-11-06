import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGameTrackerRelation1667755031044
  implements MigrationInterface
{
  name = 'UpdateGameTrackerRelation1667755031044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`game\` CHANGE \`loose\` \`trackerId\` tinyint NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`game\` DROP COLUMN \`trackerId\``);
    await queryRunner.query(`ALTER TABLE \`game\` ADD \`trackerId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_53062d0595596be2d13bf7e87a2\` FOREIGN KEY (\`trackerId\`) REFERENCES \`tracker\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_53062d0595596be2d13bf7e87a2\``,
    );
    await queryRunner.query(`ALTER TABLE \`game\` DROP COLUMN \`trackerId\``);
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD \`trackerId\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` CHANGE \`trackerId\` \`loose\` tinyint NOT NULL`,
    );
  }
}
