-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('SEDAN', 'SUV', 'MINIVAN', 'ROADSTER');

-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "car_uid" UUID NOT NULL,
    "brand" VARCHAR(80) NOT NULL,
    "model" VARCHAR(80) NOT NULL,
    "registration_number" VARCHAR(80) NOT NULL,
    "power" INTEGER,
    "price" INTEGER NOT NULL,
    "type" "CarType" NOT NULL,
    "availability" BOOLEAN NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cars_car_uid_key" ON "cars"("car_uid");
