import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSchoolInfoTable1756807170876 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "schoolinfo" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "airtelNumber" character varying,
                "mtnNumber" character varying,
                "momoCode" character varying,
                "location" character varying,
                "address" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_schoolinfo" PRIMARY KEY ("id")
            )
        `);

        // Insert default school info
        await queryRunner.query(`
            INSERT INTO "schoolinfo" ("id", "name", "email", "phone", "location", "address")
            VALUES ('550e8400-e29b-41d4-a716-446655440000', 'SchoolMart Academy', 'support@schoolmart.rw', '+250788123456', 'Kigali, Rwanda', 'KG 123 Street, Kigali, Rwanda')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "schoolinfo"`);
    }

}
