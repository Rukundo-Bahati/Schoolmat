import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSchoolInfoTable1756807213000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create schoolinfo table
        await queryRunner.query(`
            CREATE TABLE "schoolinfo" (
                "id" character varying(50) NOT NULL,
                "name" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "phone" character varying(20) NOT NULL,
                "airtelNumber" character varying(20),
                "mtnNumber" character varying(20),
                "momoCode" character varying(20),
                "location" character varying(255),
                "address" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_schoolinfo" PRIMARY KEY ("id")
            )
        `);

        // Insert default school info
        await queryRunner.query(`
            INSERT INTO "schoolinfo" ("id", "name", "email", "phone", "airtelNumber", "mtnNumber", "momoCode", "location", "address") 
            VALUES ('school-001', 'SchoolMart Academy', 'support@schoolmart.rw', '+250788123456', '+250788654321', '+250789987654', '123435', 'Kigali, Rwanda', 'KG 123 Street, Kigali, Rwanda')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "schoolinfo"`);
    }

}
