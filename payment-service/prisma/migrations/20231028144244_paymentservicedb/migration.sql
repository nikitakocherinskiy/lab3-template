-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PAID', 'CANCELED');

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "payment_uid" UUID NOT NULL,
    "status" "PaymentType" NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);
