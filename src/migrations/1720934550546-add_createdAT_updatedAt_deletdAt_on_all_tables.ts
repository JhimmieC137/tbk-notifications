import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedATUpdatedAtDeletdAtOnAllTables1720934550546 implements MigrationInterface {
    name = 'AddCreatedATUpdatedAtDeletdAtOnAllTables1720934550546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token_blacklist" ADD "created_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "token_blacklist" ADD "updated_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "token_blacklist" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token_blacklist" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "token_blacklist" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "token_blacklist" DROP COLUMN "created_at"`);
    }

}
