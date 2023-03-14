import { notFoundError } from "@/errors";
import datesRepository from "@/repositories/date-repository";

async function getDates() {
  const dates = datesRepository.getDates();
  if (!dates) throw notFoundError();
  return dates;
}

const datesService = {
  getDates,
};

export default datesService;
