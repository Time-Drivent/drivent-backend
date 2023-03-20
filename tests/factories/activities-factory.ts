import { prisma } from "@/config";

export function createActivity(dateId: number, venueId: number) {
  return prisma.activity.create({
    data: {
      name: "Minecraft: precisa montar o PC ideal?",
      startTime: "2023-09-22T12:00:00.000Z",
      endTime: "2023-09-22T13:00:00.000Z",
      capacity: 30,
      dateId,
      venueId
    }
  });
}
