import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSettingsTables1756813873053 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add new columns to schoolinfo table
        await queryRunner.query(`
            ALTER TABLE "schoolinfo"
            ADD COLUMN "orderProcessingTime" integer,
            ADD COLUMN "currency" character varying(3) DEFAULT 'RWF'
        `);

        // Create payment_methods table
        await queryRunner.query(`
            CREATE TABLE "payment_methods" (
                "id" character varying(50) NOT NULL,
                "type" character varying(20) NOT NULL,
                "provider" character varying(30) NOT NULL,
                "name" character varying(100) NOT NULL,
                "accountNumber" character varying(50),
                "accountName" character varying(100),
                "isActive" boolean NOT NULL DEFAULT true,
                "instructions" text,
                "sortOrder" integer,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_payment_methods" PRIMARY KEY ("id")
            )
        `);

        // Create notification_preferences table
        await queryRunner.query(`
            CREATE TABLE "notification_preferences" (
                "id" character varying(50) NOT NULL,
                "emailNotifications" boolean NOT NULL DEFAULT true,
                "smsNotifications" boolean NOT NULL DEFAULT true,
                "orderConfirmations" boolean NOT NULL DEFAULT true,
                "orderUpdates" boolean NOT NULL DEFAULT true,
                "paymentReminders" boolean NOT NULL DEFAULT true,
                "lowStockAlerts" boolean NOT NULL DEFAULT true,
                "newOrderAlerts" boolean NOT NULL DEFAULT true,
                "marketingEmails" boolean NOT NULL DEFAULT false,
                "emailRecipients" text,
                "smsRecipients" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_notification_preferences" PRIMARY KEY ("id")
            )
        `);

        // Create system_preferences table
        await queryRunner.query(`
            CREATE TABLE "system_preferences" (
                "id" character varying(50) NOT NULL,
                "theme" character varying(10) NOT NULL DEFAULT 'light',
                "language" character varying(5) NOT NULL DEFAULT 'en',
                "autoSave" boolean NOT NULL DEFAULT true,
                "sessionTimeout" integer NOT NULL DEFAULT 30,
                "enableAnalytics" boolean NOT NULL DEFAULT true,
                "enableBackups" boolean NOT NULL DEFAULT true,
                "backupFrequency" integer,
                "maintenanceMode" boolean NOT NULL DEFAULT false,
                "maintenanceMessage" text,
                "itemsPerPage" integer NOT NULL DEFAULT 10,
                "timezone" character varying(50) NOT NULL DEFAULT 'UTC',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_system_preferences" PRIMARY KEY ("id")
            )
        `);

        // Insert default data
        await queryRunner.query(`
            INSERT INTO "notification_preferences" ("id", "emailNotifications", "smsNotifications", "orderConfirmations", "orderUpdates", "paymentReminders", "lowStockAlerts", "newOrderAlerts", "marketingEmails")
            VALUES ('default-prefs', true, true, true, true, true, true, true, false)
        `);

        await queryRunner.query(`
            INSERT INTO "system_preferences" ("id", "theme", "language", "autoSave", "sessionTimeout", "enableAnalytics", "enableBackups", "maintenanceMode", "itemsPerPage", "timezone")
            VALUES ('default-system-prefs', 'light', 'en', true, 30, true, true, false, 10, 'UTC')
        `);

        // Insert default payment methods
        await queryRunner.query(`
            INSERT INTO "payment_methods" ("id", "type", "provider", "name", "accountNumber", "accountName", "isActive", "instructions", "sortOrder")
            VALUES
            ('airtel-money-001', 'mobile_money', 'airtel', 'Airtel Money', '+250788123456', 'SchoolMart Academy', true, 'Dial *182*1*1# to pay', 1),
            ('mtn-momo-001', 'mobile_money', 'mtn', 'MTN Mobile Money', '+250789987654', 'SchoolMart Academy', true, 'Dial *182*1*1# to pay', 2),
            ('cash-001', 'cash', 'cash', 'Cash Payment', NULL, NULL, true, 'Pay in person at school office', 3)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables
        await queryRunner.query(`DROP TABLE "system_preferences"`);
        await queryRunner.query(`DROP TABLE "notification_preferences"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);

        // Remove columns from schoolinfo
        await queryRunner.query(`
            ALTER TABLE "schoolinfo"
            DROP COLUMN "currency",
            DROP COLUMN "orderProcessingTime"
        `);
    }

}
