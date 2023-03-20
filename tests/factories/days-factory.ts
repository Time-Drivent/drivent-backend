import { prisma } from "@/config";

export function createDay() {
  return prisma.day.create({
    data: {
      weekday: "Domingo",
      date: new Date(2023, 9, 24),
    }
  });
}
