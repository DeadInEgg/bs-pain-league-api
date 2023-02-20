import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropModeIdInGame1676884108770 implements MigrationInterface {
  name = 'migrations1676884108770';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`map\` DROP FOREIGN KEY \`FK_2e7dabee215ca3be4c6137389a1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_ef9a2ad96f7bcea1655cd17e575\``,
    );
    await queryRunner.query(`ALTER TABLE \`game\` DROP COLUMN \`mode_id\``);
    await queryRunner.query(
      `ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_15dca7a4369ac466eea4cbacd2b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` CHANGE \`map_id\` \`map_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`map\` ADD CONSTRAINT \`FK_266ebbc37561e17051257f932c1\` FOREIGN KEY (\`mode_id\`) REFERENCES \`mode\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_15dca7a4369ac466eea4cbacd2b\` FOREIGN KEY (\`map_id\`) REFERENCES \`map\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_15dca7a4369ac466eea4cbacd2b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`map\` DROP FOREIGN KEY \`FK_266ebbc37561e17051257f932c1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` CHANGE \`map_id\` \`map_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_15dca7a4369ac466eea4cbacd2b\` FOREIGN KEY (\`map_id\`) REFERENCES \`map\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD \`mode_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_ef9a2ad96f7bcea1655cd17e575\` FOREIGN KEY (\`mode_id\`) REFERENCES \`mode\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`map\` ADD CONSTRAINT \`FK_2e7dabee215ca3be4c6137389a1\` FOREIGN KEY (\`mode_id\`) REFERENCES \`mode\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
