import { prisma } from "@/config";

export function createReservation(activityId: number, userId: number) {
  return prisma.reservation.create({
    data: {
      activityId,
      userId
    }
  });
}
