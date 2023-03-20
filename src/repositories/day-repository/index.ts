import { prisma } from "@/config";

function getDays() {
  return prisma.day.findMany();
}

const daysRepository = {
  getDays,
};

export default daysRepository;
