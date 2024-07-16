import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersProfilesKycsAndTokenBlaclistsTables1720891876769 implements MigrationInterface {
    name = 'CreateUsersProfilesKycsAndTokenBlaclistsTables1720891876769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "token_blacklist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, CONSTRAINT "PK_3e37528d03f0bd5335874afa48d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "token_blacklist"`);
    }

}
