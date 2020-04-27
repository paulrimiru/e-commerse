import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration11572603088379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE "user_role_enum" AS ENUM('admin', 'user', 'un-verified')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "username" character varying NOT NULL, "email" character varying NOT NULL, "verified" boolean NOT NULL DEFAULT false, "role" "user_role_enum" NOT NULL DEFAULT 'un-verified', "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "delivery_status_enum" AS ENUM('preperation', 'dispatched', 'completed', 'canceled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "delivery_type_enum" AS ENUM('pick-up', 'drop-off')`,
    );
    await queryRunner.query(
      `CREATE TABLE "delivery" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "status" "delivery_status_enum" NOT NULL DEFAULT 'preperation', "type" "delivery_type_enum" NOT NULL DEFAULT 'drop-off', CONSTRAINT "PK_ffad7bf84e68716cd9af89003b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "order_orderstatus_enum" AS ENUM('cart', 'delivery', 'complete', 'canceled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "totalAmount" integer, "address" character varying NOT NULL, "orderStatus" "order_orderstatus_enum" NOT NULL DEFAULT 'cart', "userId" uuid, "deliveryId" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "serialNumber" character varying NOT NULL, "productId" uuid, "orderId" uuid, CONSTRAINT "UQ_24ee3ad39374438ee920080955b" UNIQUE ("serialNumber"), CONSTRAINT "PK_83c3b7a80f6fe1d5ad7fa05a2a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "product_unitpriceunit_enum" AS ENUM('kg', 'grams', 'item', 'pair', 'dozen')`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "quantity" integer NOT NULL, "discount" integer NOT NULL DEFAULT 0, "pictures" text NOT NULL, "categoryId" uuid, "unitPriceUnit" "product_unitpriceunit_enum" NOT NULL DEFAULT 'item', "unitPricePrice" integer NOT NULL, CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "description" character varying NOT NULL, "picture" character varying NOT NULL, CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "password_reset_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "code" character varying NOT NULL, "valid" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_ee2e748d67c66b2e71e0c043fac" PRIMARY KEY ("id", "email", "code"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_ec67a0143b254c3577087b20d3a" FOREIGN KEY ("deliveryId") REFERENCES "delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_item" ADD CONSTRAINT "FK_5be351f01d190ba6c78adc013a9" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_item" ADD CONSTRAINT "FK_7ed6d6a7c935b181ddda02e0616" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_item" DROP CONSTRAINT "FK_7ed6d6a7c935b181ddda02e0616"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_item" DROP CONSTRAINT "FK_5be351f01d190ba6c78adc013a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_ec67a0143b254c3577087b20d3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(`DROP TABLE "password_reset_requests"`);
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TYPE "product_unitpriceunit_enum"`);
    await queryRunner.query(`DROP TABLE "product_item"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "order_orderstatus_enum"`);
    await queryRunner.query(`DROP TABLE "delivery"`);
    await queryRunner.query(`DROP TYPE "delivery_type_enum"`);
    await queryRunner.query(`DROP TYPE "delivery_status_enum"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
