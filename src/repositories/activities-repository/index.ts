import { prisma } from "@/config";

async function findEventDays() {
  return prisma.day.findMany();
}

async function findEventsByEventsDayId(eventDayId: number) {
  return prisma.activity.findMany({
    where: {
      dateId: eventDayId,
    },
    include: {
      Reservation: {
        select: {
          id: true,
          userId: true,
        },
      },
      Venue: true,
      Day: true,
    },
  });
}

const activityRepository = {
  findEventDays,
  findEventsByEventsDayId,
};

export default activityRepository;
