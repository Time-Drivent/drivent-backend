import { notFoundError } from "@/errors";
import daysRepository from "@/repositories/day-repository";

async function getDays() {
  const dates = await daysRepository.getDays();
  if (dates.length === 0) throw notFoundError();
  return dates;
}

const daysService = {
  getDays,
};

export default daysService;
