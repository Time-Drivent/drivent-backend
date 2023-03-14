import { prisma } from "@/config";

function getDates() {
  return prisma.date.findMany();
}

const datesRepository = {
  getDates,
};

export default datesRepository;
