import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsDeletedToNotifications1721169943368 implements MigrationInterface {
    name = 'AddColumnIsDeletedToNotifications1721169943368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "is_deleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "is_deleted"`);
    }

}
