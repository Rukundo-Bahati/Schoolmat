import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNotificationPreferencesTable1756841428036 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename old columns that are no longer used
        await queryRunner.query(`
            ALTER TABLE "notification_preferences"
            RENAME COLUMN "orderUpdates" TO "deliveryUpdates"
        `);
        // If you want to drop old columns instead of renaming, use DROP COLUMN instead
        // Add any other necessary schema updates here
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the column rename
        await queryRunner.query(`
            ALTER TABLE "notification_preferences"
            RENAME COLUMN "deliveryUpdates" TO "orderUpdates"
        `);
    }

}
