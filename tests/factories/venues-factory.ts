import { prisma } from "@/config";

export function createVenue() {
  return prisma.venue.create({
    data: {
      name: "Auditório Principal"
    }
  });
}
