import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const car = await prisma.car.create({
    data: {
      car_uid: '109b42f3-198d-4c89-9276-a7520a7120ab',
      brand: 'Mercedes Benz',
      model: 'GLA 250',
      registration_number: 'ЛО777Х799',
      power: 249,
      type: 'SEDAN',
      price: 3500,
      availability: true,
    },
  });
  console.log({ car });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
