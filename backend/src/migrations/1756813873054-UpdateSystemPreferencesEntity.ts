import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSystemPreferencesEntity1756813873054 implements MigrationInterface {
    name = 'UpdateSystemPreferencesEntity1756813873054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to system_preferences table
        await queryRunner.query(`
            ALTER TABLE "system_preferences"
            ADD COLUMN "defaultOrderStatus" character varying NOT NULL DEFAULT 'pending',
            ADD COLUMN "autoApproveOrders" boolean NOT NULL DEFAULT false,
            ADD COLUMN "lowStockThreshold" integer NOT NULL DEFAULT 10,
            ADD COLUMN "dataRetentionPeriod" integer NOT NULL DEFAULT 365
        `);

        // Update maintenanceMode default value
        await queryRunner.query(`
            ALTER TABLE "system_preferences"
            ALTER COLUMN "maintenanceMode" SET DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove the new columns
        await queryRunner.query(`
            ALTER TABLE "system_preferences"
            DROP COLUMN "defaultOrderStatus",
            DROP COLUMN "autoApproveOrders",
            DROP COLUMN "lowStockThreshold",
            DROP COLUMN "dataRetentionPeriod"
        `);

        // Revert maintenanceMode default value
        await queryRunner.query(`
            ALTER TABLE "system_preferences"
            ALTER COLUMN "maintenanceMode" SET DEFAULT true
        `);
    }
}
