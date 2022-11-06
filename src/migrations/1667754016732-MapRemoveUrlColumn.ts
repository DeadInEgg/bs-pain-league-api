import { MigrationInterface, QueryRunner } from "typeorm";

export class MapRemoveUrlColumn1667754016732 implements MigrationInterface {
    name = 'MapRemoveUrlColumn1667754016732'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`map\` DROP COLUMN \`url\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`map\` ADD \`url\` varchar(255) NOT NULL`);
    }

}
