import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSalesTable1756742500000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create sales table
        await queryRunner.query(`
            CREATE TABLE "sales" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid,
                "customerName" character varying NOT NULL,
                "customerEmail" character varying NOT NULL,
                "customerPhone" character varying,
                "description" text NOT NULL,
                "totalAmount" numeric NOT NULL,
                "paidAmount" numeric NOT NULL DEFAULT 0,
                "status" character varying NOT NULL DEFAULT 'pending',
                "paymentStatus" character varying NOT NULL DEFAULT 'unpaid',
                "expectedCloseDate" TIMESTAMP,
                "actualCloseDate" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8ff" PRIMARY KEY ("id")
            )
        `);

        // Create foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "sales" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fg" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        // Create indexes for better performance
        await queryRunner.query(`
            CREATE INDEX "IDX_sales_userId" ON "sales" ("userId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_sales_status" ON "sales" ("status")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_sales_paymentStatus" ON "sales" ("paymentStatus")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_sales_expectedCloseDate" ON "sales" ("expectedCloseDate")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_sales_expectedCloseDate"`);
        await queryRunner.query(`DROP INDEX "IDX_sales_paymentStatus"`);
        await queryRunner.query(`DROP INDEX "IDX_sales_status"`);
        await queryRunner.query(`DROP INDEX "IDX_sales_userId"`);

        // Drop foreign key constraint
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8fg"`);

        // Drop table
        await queryRunner.query(`DROP TABLE "sales"`);
    }

}
