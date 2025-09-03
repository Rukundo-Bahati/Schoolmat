import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1756742362014 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "phone" character varying,
                "role" character varying NOT NULL DEFAULT 'parent',
                "status" character varying NOT NULL DEFAULT 'active',
                "otp" character varying,
                "otpExpiresAt" TIMESTAMP,
                "isEmailVerified" boolean NOT NULL DEFAULT false,
                "profileImageUrl" character varying,
                "address" text,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("id")
            )
        `);

        // Create unique index on email
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email")
        `);

        // Create products table
        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "category" character varying NOT NULL,
                "price" numeric NOT NULL,
                "stock" integer NOT NULL,
                "minStock" integer NOT NULL,
                "required" boolean NOT NULL,
                "description" text,
                "supplier" character varying NOT NULL,
                "imageUrl" character varying NOT NULL,
                "lastUpdated" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8f4" PRIMARY KEY ("id")
            )
        `);

        // Create orders table
        await queryRunner.query(`
            CREATE TABLE "orders" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid,
                "parentName" character varying NOT NULL,
                "parentEmail" character varying NOT NULL,
                "parentPhone" character varying NOT NULL,
                "studentName" character varying NOT NULL,
                "studentGrade" character varying NOT NULL,
                "studentClass" character varying NOT NULL,
                "totalAmount" numeric NOT NULL,
                "status" character varying NOT NULL DEFAULT 'pending',
                "orderDate" TIMESTAMP NOT NULL DEFAULT now(),
                "paymentMethod" character varying NOT NULL,
                "deliveryAddress" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8f5" PRIMARY KEY ("id")
            )
        `);

        // Create order_items table
        await queryRunner.query(`
            CREATE TABLE "order_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "orderId" uuid,
                "productId" uuid,
                "productName" character varying NOT NULL,
                "quantity" integer NOT NULL,
                "price" numeric NOT NULL,
                "category" character varying NOT NULL,
                CONSTRAINT "PK_4c88e956195bba85977da21b8f6" PRIMARY KEY ("id")
            )
        `);

        // Create cart_items table
        await queryRunner.query(`
            CREATE TABLE "cart_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid,
                "productId" uuid,
                "productName" character varying NOT NULL,
                "quantity" integer NOT NULL,
                "price" numeric NOT NULL,
                "category" character varying NOT NULL,
                "imageUrl" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8f7" PRIMARY KEY ("id")
            )
        `);

        // Create notifications table
        await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userId" uuid,
                "message" text NOT NULL,
                "type" character varying NOT NULL,
                "priority" character varying NOT NULL DEFAULT 'medium',
                "read" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c88e956195bba85977da21b8f8" PRIMARY KEY ("id")
            )
        `);

        // Create foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "orders" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8f9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "order_items" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fa" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "order_items" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fb" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fd" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "notifications" ADD CONSTRAINT "FK_4c88e956195bba85977da21b8fe" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8fe"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8fd"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8fc"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8fb"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8fa"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_4c88e956195bba85977da21b8f9"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
