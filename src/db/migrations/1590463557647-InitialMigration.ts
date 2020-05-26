import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1590463557647 implements MigrationInterface {
  name = 'InitialMigration1590463557647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "role" TO "roleId"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."user_role_enum" RENAME TO "user_roleid_enum"`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "UQ_240853a0c3353c25fb12434ad33" UNIQUE ("name"), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permission" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "roleId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_b42bbacb8402c353df822432544" PRIMARY KEY ("roleId", "permissionId"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "default" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD "coordinates" jsonb`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "roleId"`,
      undefined,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "roleId" uuid`, undefined);
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_e3130a39c1e4a740d044e685730" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" ADD CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_72e80be86cab0e93e67ed1a7a9a"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permission" DROP CONSTRAINT "FK_e3130a39c1e4a740d044e685730"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "roleId"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "roleId" "user_roleid_enum" NOT NULL DEFAULT 'un-verified'`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "coordinates"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "role"`, undefined);
    await queryRunner.query(`DROP TABLE "role_permission"`, undefined);
    await queryRunner.query(`DROP TABLE "permission"`, undefined);
    await queryRunner.query(
      `ALTER TYPE "user_roleid_enum" RENAME TO "user_role_enum"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "roleId" TO "role"`,
      undefined,
    );
  }
}
