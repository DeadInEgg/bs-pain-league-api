import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFighterTables1670533095478 implements MigrationInterface {
  name = 'migrations1670533095478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`fighter\` (\`id\` int NOT NULL AUTO_INCREMENT, \`opponent\` tinyint NOT NULL, \`me\` tinyint NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`gameId\` int NULL, \`brawlerId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`fighter\` ADD CONSTRAINT \`FK_7874fdebf2d55cab3bdce531afe\` FOREIGN KEY (\`gameId\`) REFERENCES \`game\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`fighter\` ADD CONSTRAINT \`FK_1f97f30586b5f24522009eb7ffe\` FOREIGN KEY (\`brawlerId\`) REFERENCES \`brawler\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`fighter\` DROP FOREIGN KEY \`FK_1f97f30586b5f24522009eb7ffe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`fighter\` DROP FOREIGN KEY \`FK_7874fdebf2d55cab3bdce531afe\``,
    );
    await queryRunner.query(`DROP TABLE \`fighter\``);
  }
}
