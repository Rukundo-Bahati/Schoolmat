import { MigrationInterface, QueryRunner } from "typeorm";

export class DropAndRecreateNotificationsTable1756811194514 implements MigrationInterface {
    name = 'DropAndRecreateNotificationsTable1756811194514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing table and types if they exist, cascade to remove dependencies
        await queryRunner.query(`DROP TABLE IF EXISTS "notifications" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "notification_status_enum" CASCADE`);
        await queryRunner.query(`DROP TYPE IF EXISTS "notification_type_enum" CASCADE`);

        // Create enum types
        await queryRunner.query(`
            CREATE TYPE "notification_type_enum" AS ENUM('order', 'payment', 'general')
        `);

        await queryRunner.query(`
            CREATE TYPE "notification_status_enum" AS ENUM('unread', 'read', 'failed')
        `);

        // Create notifications table
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying(255) NOT NULL,
                "message" text NOT NULL,
                "type" "notification_type_enum" NOT NULL DEFAULT 'general',
                "status" "notification_status_enum" NOT NULL DEFAULT 'unread',
                "orderId" character varying(255),
                "isRead" boolean NOT NULL DEFAULT false,
                "metadata" json,
                "userId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
            )
        `);

        // Create indexes
        await queryRunner.query(`
            CREATE INDEX "IDX_notifications_userId" ON "notifications" ("userId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_notifications_type" ON "notifications" ("type")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_notifications_isRead" ON "notifications" ("isRead")
        `);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD CONSTRAINT "FK_notifications_userId"
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_userId"
        `);

        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_notifications_isRead"`);
        await queryRunner.query(`DROP INDEX "IDX_notifications_type"`);
        await queryRunner.query(`DROP INDEX "IDX_notifications_userId"`);

        // Drop notifications table
        await queryRunner.query(`DROP TABLE "notifications"`);

        // Drop enum types
        await queryRunner.query(`DROP TYPE "notification_status_enum"`);
        await queryRunner.query(`DROP TYPE "notification_type_enum"`);
    }
}
