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

async function findActivityById(activityId: number) {
  return prisma.activity.findFirst({
    where: { id: activityId },
    include: {
      Reservation: true,
      _count: {
        select: {
          Reservation: true
        }
      }
    },
  });
}

async function findscheduledActivitiesByticketId(userId: number) {
  return prisma.reservation.findMany({
    where: {
      userId,
    },
    include: {
      Activity: true,
    },
  });
}

async function createActivityTicket(activityId: number, userId: number) {
  const activity = await prisma.activity.findUnique({ where: { id: activityId } });
  const activityCapacity = activity?.capacity;

   const [find, create] = await prisma.$transaction([
    prisma.reservation.findMany({where:{ activityId}}),
    prisma.reservation.create({
      data:{
        userId: userId,
        activityId: activityId
      }
    })
  ]) 
  if (find.length >= activityCapacity) {
    throw new Error("There are no more vacancies!");
  }
  return create;
}

const activityRepository = {
  findEventDays,
  findEventsByEventsDayId,
  findActivityById,
  createActivityTicket,
  findscheduledActivitiesByticketId
};

export default activityRepository;
