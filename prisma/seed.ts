import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toISOString(),
        endsAt: dayjs().add(21, "days").toISOString(),
      },
    });
  }
  let hotels = await prisma.hotel.findMany();
  if (hotels.length === 0) {
    await prisma.hotel.createMany({
      data: [
        {
          name: "Copacabana Palace",
          image: "http://static.casadevalentina.com.br/assets/files/2014/01/jpg/b5aff882325c36b33c1e36d1ef642144.jpg",
        },
        {
          name: "Emporio Acapulco",
          image: "https://media.staticontent.com/media/pictures/fb28e603-78cf-44e9-b87a-8834f09eb96a",
        },
        {
          name: "Hotel Fazenda",
          image:
            "https://i2.wp.com/riocomcriancas.com.br/wp-content/uploads/2020/03/Hotel-Fazenda-Ribeir%C3%A3o.jpg?fit=800%2C600&ssl=1",
        },
      ],
    });
    const h1 = await prisma.hotel.findFirst({
      where: { name: "Copacabana Palace" },
    });
    const h2 = await prisma.hotel.findFirst({
      where: { name: "Emporio Acapulco" },
    });
    const h3 = await prisma.hotel.findFirst({
      where: { name: "Hotel Fazenda" },
    });
    await prisma.room.createMany({
      data: [
        {
          name: "101",
          capacity: 2,
          hotelId: h1?.id ?? 1,
        },
        {
          name: "101",
          capacity: 1,
          hotelId: h1?.id ?? 1,
        },
        {
          name: "101",
          capacity: 3,
          hotelId: h1?.id ?? 1,
        },
      ],
    });
    await prisma.room.createMany({
      data: [
        {
          name: "101",
          capacity: 2,
          hotelId: h3?.id ?? 3,
        },
        {
          name: "101",
          capacity: 3,
          hotelId: h3?.id ?? 3,
        },
      ],
    });
    await prisma.room.createMany({
      data: [
        {
          name: "101",
          capacity: 2,
          hotelId: h2?.id ?? 2,
        },
        {
          name: "101",
          capacity: 1,
          hotelId: h2?.id ?? 2,
        },
      ],
    });
  }
  let ticketTypes = await prisma.ticketType.findMany();
  if (ticketTypes.length === 0) {
    await prisma.ticketType.createMany({
      data: [
        {
          name: "Presencial",
          includesHotel: false,
          isRemote: false,
          price: 250,
        },
        {
          name: "Presencial Com Hotel",
          includesHotel: true,
          isRemote: false,
          price: 600,
        },
        {
          name: "Online",
          includesHotel: false,
          isRemote: true,
          price: 100,
        },
      ],
    });
  }
  //console.log({ event });
  let venues = await prisma.venue.findMany();
  if (venues.length === 0) {
    await prisma.venue.createMany({
      data: [
        {
          name: "Auditório Principal",
        },
        {
          name: "Auditório Lateral",
        },
        {
          name: "Sala de Workshop",
        },
      ],
    });
  }

  let dates = await prisma.date.findMany();
  if (dates.length === 0) {
    await prisma.date.createMany({
      data: [
        {
          weekday: "Sexta",
          date: new Date(2023, 9, 22).toISOString(),
        },
        {
          weekday: "Sábado",
          date: new Date(2023, 9, 23).toISOString(),
        },
        {
          weekday: "Domingo",
          date: new Date(2023, 9, 24).toISOString(),
        },
      ],
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
