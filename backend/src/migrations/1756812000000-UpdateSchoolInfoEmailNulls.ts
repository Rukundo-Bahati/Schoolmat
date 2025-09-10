import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchoolInfoEmailNulls1756812000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update any null email values in schoolinfo table to a default email
        await queryRunner.query(`
            UPDATE "schoolinfo"
            SET "email" = 'default@schoolmart.rw'
            WHERE "email" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No need to revert this change as it's fixing data integrity
    }

}
