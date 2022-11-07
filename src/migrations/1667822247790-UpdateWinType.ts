import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateWinType1667822247790 implements MigrationInterface {
    name = 'UpdateWinType1667822247790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`game\` CHANGE \`win\` \`result\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`game\` DROP COLUMN \`result\``);
        await queryRunner.query(`ALTER TABLE \`game\` ADD \`result\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`game\` DROP COLUMN \`result\``);
        await queryRunner.query(`ALTER TABLE \`game\` ADD \`result\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`game\` CHANGE \`result\` \`win\` varchar(255) NOT NULL`);
    }

}
