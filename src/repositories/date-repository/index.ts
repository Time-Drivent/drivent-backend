import { prisma } from "@/config";

function getDates() {
  return prisma.day.findMany();
}

const datesRepository = {
  getDates,
};

export default datesRepository;
