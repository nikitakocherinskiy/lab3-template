-- CreateEnum
CREATE TYPE "RentalType" AS ENUM ('IN_PROGRESS', 'FINISHED', 'CANCELED');

-- CreateTable
CREATE TABLE "rental" (
    "id" SERIAL NOT NULL,
    "rental_uid" UUID NOT NULL,
    "username" VARCHAR(80) NOT NULL,
    "payment_uid" UUID NOT NULL,
    "car_uid" UUID NOT NULL,
    "date_from" TIMESTAMP(3) NOT NULL,
    "date_to" TIMESTAMP(3) NOT NULL,
    "status" "RentalType" NOT NULL,

    CONSTRAINT "rental_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rental_rental_uid_key" ON "rental"("rental_uid");
