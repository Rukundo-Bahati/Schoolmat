import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToProducts1760687200000 implements MigrationInterface {
    name = 'AddIsActiveToProducts1760687200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add isActive column to products table with default value true
        await queryRunner.query(`ALTER TABLE "products" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove isActive column from products table
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "isActive"`);
    }
}