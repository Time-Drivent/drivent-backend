import { notFoundError } from "@/errors";
import datesRepository from "@/repositories/date-repository";

async function getDates() {
  const dates = await datesRepository.getDates();
  if (dates.length === 0) throw notFoundError();
  return dates;
}

const datesService = {
  getDates,
};

export default datesService;
