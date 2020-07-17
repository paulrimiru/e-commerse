import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1590463557647 implements MigrationInterface {
  name = 'InitialMigration1590463557647';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, "roleId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TYPE "delivery_status_enum" AS ENUM('preperation', 'dispatched', 'completed', 'canceled')`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TYPE "delivery_type_enum" AS ENUM('pick-up', 'drop-off')`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "delivery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" "delivery_status_enum" NOT NULL DEFAULT 'preperation', "type" "delivery_type_enum" NOT NULL DEFAULT 'drop-off', CONSTRAINT "PK_ffad7bf84e68716cd9af89003b0" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TYPE "order_orderstatus_enum" AS ENUM('cart', 'delivery', 'complete', 'canceled')`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "totalAmount" integer, "address" character varying NOT NULL, "coordinates" jsonb, "orderStatus" "order_orderstatus_enum" NOT NULL DEFAULT 'cart', "userId" uuid, "deliveryId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "product_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "serialNumber" character varying NOT NULL, "productId" uuid, "orderId" uuid, CONSTRAINT "UQ_24ee3ad39374438ee920080955b" UNIQUE ("serialNumber"), CONSTRAINT "PK_83c3b7a80f6fe1d5ad7fa05a2a2" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TYPE "product_unitpriceunit_enum" AS ENUM('kg', 'grams', 'item', 'pair', 'dozen')`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "quantity" integer NOT NULL, "discount" integer NOT NULL DEFAULT 0, "pictures" text NOT NULL, "categoryId" uuid, "unitPriceUnit" "product_unitpriceunit_enum" NOT NULL DEFAULT 'item', "unitPricePrice" integer NOT NULL, CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "picture" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "password_reset_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "code" character varying NOT NULL, "valid" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_ee2e748d67c66b2e71e0c043fac" PRIMARY KEY ("id", "email", "code"))`,
      undefined,
    );
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
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_ec67a0143b254c3577087b20d3a" FOREIGN KEY ("deliveryId") REFERENCES "delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "product_item" ADD CONSTRAINT "FK_5be351f01d190ba6c78adc013a9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "product_item" ADD CONSTRAINT "FK_7ed6d6a7c935b181ddda02e0616" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "product_item" DROP CONSTRAINT "FK_7ed6d6a7c935b181ddda02e0616"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "product_item" DROP CONSTRAINT "FK_5be351f01d190ba6c78adc013a9"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_ec67a0143b254c3577087b20d3a"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
      undefined,
    );
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
    await queryRunner.query(`DROP TABLE "password_reset_requests"`, undefined);
    await queryRunner.query(`DROP TABLE "category"`, undefined);
    await queryRunner.query(`DROP TABLE "product"`, undefined);
    await queryRunner.query(
      `DROP TYPE "product_unitpriceunit_enum"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "product_item"`, undefined);
    await queryRunner.query(`DROP TABLE "order"`, undefined);
    await queryRunner.query(`DROP TYPE "order_orderstatus_enum"`, undefined);
    await queryRunner.query(`DROP TABLE "delivery"`, undefined);
    await queryRunner.query(`DROP TYPE "delivery_type_enum"`, undefined);
    await queryRunner.query(`DROP TYPE "delivery_status_enum"`, undefined);
    await queryRunner.query(`DROP TABLE "user"`, undefined);
    await queryRunner.query(`DROP TABLE "role"`, undefined);
    await queryRunner.query(`DROP TABLE "role_permission"`, undefined);
    await queryRunner.query(`DROP TABLE "permission"`, undefined);
  }
}
