import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1667853413719 implements MigrationInterface {
  name = 'CreateTables1667853413719';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`mail\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_7395ecde6cda2e7fe90253ec59\` (\`mail\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tracker\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`tag\` varchar(255) NULL, \`hash\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`mode\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`map\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`game\` (\`id\` int NOT NULL AUTO_INCREMENT, \`result\` enum ('victory', 'draw', 'defeat') NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`map_id\` int NOT NULL, \`mode_id\` int NOT NULL, \`tracker_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`maps_modes\` (\`map_id\` int NOT NULL, \`mode_id\` int NOT NULL, INDEX \`IDX_b8ccd3f6bcfae440fd41d87153\` (\`map_id\`), INDEX \`IDX_38b1e304331c29c604febe40b7\` (\`mode_id\`), PRIMARY KEY (\`map_id\`, \`mode_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tracker\` ADD CONSTRAINT \`FK_345b2e5d9a0e81128b016333c82\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`mode\` ADD CONSTRAINT \`FK_41a05ffef49d7a4a953f01f3711\` FOREIGN KEY (\`type_id\`) REFERENCES \`type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_15dca7a4369ac466eea4cbacd2b\` FOREIGN KEY (\`map_id\`) REFERENCES \`map\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_ef9a2ad96f7bcea1655cd17e575\` FOREIGN KEY (\`mode_id\`) REFERENCES \`mode\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` ADD CONSTRAINT \`FK_d985b507b9cd35100747a01964a\` FOREIGN KEY (\`tracker_id\`) REFERENCES \`tracker\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`maps_modes\` ADD CONSTRAINT \`FK_b8ccd3f6bcfae440fd41d871536\` FOREIGN KEY (\`map_id\`) REFERENCES \`map\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`maps_modes\` ADD CONSTRAINT \`FK_38b1e304331c29c604febe40b73\` FOREIGN KEY (\`mode_id\`) REFERENCES \`mode\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`maps_modes\` DROP FOREIGN KEY \`FK_38b1e304331c29c604febe40b73\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`maps_modes\` DROP FOREIGN KEY \`FK_b8ccd3f6bcfae440fd41d871536\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_d985b507b9cd35100747a01964a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_ef9a2ad96f7bcea1655cd17e575\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`game\` DROP FOREIGN KEY \`FK_15dca7a4369ac466eea4cbacd2b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`mode\` DROP FOREIGN KEY \`FK_41a05ffef49d7a4a953f01f3711\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tracker\` DROP FOREIGN KEY \`FK_345b2e5d9a0e81128b016333c82\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_38b1e304331c29c604febe40b7\` ON \`maps_modes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b8ccd3f6bcfae440fd41d87153\` ON \`maps_modes\``,
    );
    await queryRunner.query(`DROP TABLE \`maps_modes\``);
    await queryRunner.query(`DROP TABLE \`game\``);
    await queryRunner.query(`DROP TABLE \`map\``);
    await queryRunner.query(`DROP TABLE \`mode\``);
    await queryRunner.query(`DROP TABLE \`type\``);
    await queryRunner.query(`DROP TABLE \`tracker\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_7395ecde6cda2e7fe90253ec59\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
