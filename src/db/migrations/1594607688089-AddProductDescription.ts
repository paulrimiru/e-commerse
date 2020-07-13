import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductDescription1594607688089 implements MigrationInterface {
  name = 'AddProductDescription1594607688089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD "description" character varying`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "description"`,
      undefined,
    );
  }
}
