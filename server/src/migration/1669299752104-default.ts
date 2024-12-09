import { MigrationInterface, QueryRunner } from "typeorm";

export class default1669299752104 implements MigrationInterface {
    name = 'default1669299752104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" (
            "user_id" SERIAL PRIMARY KEY,
            "nama" text NOT NULL,
            "email" text NOT NULL UNIQUE,
            "password" text NOT NULL,
            "tanggal_daftar" date NOT NULL,
            "no_telp" text,
            "role" text NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        )`);

        await queryRunner.query(`CREATE TABLE "coworking" (
            "coworking_id" SERIAL PRIMARY KEY,
            "no_ruang" text NOT NULL,
            "id_admin" integer NOT NULL,
            "status_ruang" text NOT NULL
        )`);

        await queryRunner.query(`CREATE TABLE "reservation" (
            "reservation_id" SERIAL PRIMARY KEY,
            "user_id" integer NOT NULL,
            "coworking_id" integer NOT NULL,
            "id_admin" integer NOT NULL,
            "waktu_mulai" TIMESTAMP NOT NULL,
            "waktu_selesai" TIMESTAMP NOT NULL,
            "status_reservasi" text NOT NULL
        )`);

        await queryRunner.query(`CREATE TABLE "review" (
            "review_id" SERIAL PRIMARY KEY,
            "coworking_id" integer NOT NULL,
            "komentar" text,
            "tanggal_review" date NOT NULL
        )`);

        await queryRunner.query(`CREATE TABLE "payment" (
            "payment_id" SERIAL PRIMARY KEY,
            "jumlah_pembayaran" decimal(10,2) NOT NULL,
            "metode_pembayaran" text NOT NULL,
            "waktu_pembayaran" TIMESTAMP NOT NULL,
            "status_pembayaran" text NOT NULL,
            "reservation_id" integer NOT NULL
        )`);

        await queryRunner.query(`CREATE TABLE "notification" (
            "notification_id" SERIAL PRIMARY KEY,
            "user_id" integer NOT NULL,
            "judul" text NOT NULL,
            "pesan" text NOT NULL,
            "tipe" text NOT NULL,
            "dibaca" boolean NOT NULL DEFAULT false,
            "waktu_notifikasi" TIMESTAMP NOT NULL DEFAULT now()
        )`);

        // Menambahkan foreign key constraints
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_user_reservation" FOREIGN KEY ("user_id") REFERENCES "users"("user_id")`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_coworking_reservation" FOREIGN KEY ("coworking_id") REFERENCES "coworking"("coworking_id")`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_reservation_payment" FOREIGN KEY ("reservation_id") REFERENCES "reservation"("reservation_id")`);
        await queryRunner.query(`ALTER TABLE "review" ADD CONSTRAINT "FK_coworking_review" FOREIGN KEY ("coworking_id") REFERENCES "coworking"("coworking_id")`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_user_notification" FOREIGN KEY ("user_id") REFERENCES "users"("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TABLE "review"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP TABLE "coworking"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }
}
