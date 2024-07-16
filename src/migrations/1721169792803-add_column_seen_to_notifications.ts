import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnSeenToNotifications1721169792803 implements MigrationInterface {
    name = 'AddColumnSeenToNotifications1721169792803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_53034dfead6f96c1bd0083f4cab"`);
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "profileId" TO "seen"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "seen"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "seen" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "seen"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "seen" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" RENAME COLUMN "seen" TO "profileId"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_53034dfead6f96c1bd0083f4cab" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
