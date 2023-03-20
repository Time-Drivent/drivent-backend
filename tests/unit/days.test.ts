import datesRepository from "@/repositories/day-repository";
import datesService from "@/services/days-service";

describe("datesService.GetDates", () => {
  it("Should return dates when everything is ok", () => {
    jest.spyOn(datesRepository, "getDays").mockImplementationOnce((): any => {
      return [{ date: true }];
    });

    const response = datesService.getDays();

    expect(response).toEqual(expect.not.arrayContaining([expect.not.objectContaining({ date: true })]));
  });
  it("Should throw error when no dates are found", () => {
    jest.spyOn(datesRepository, "getDays").mockImplementationOnce((): any => {
      return [];
    });

    const response = datesService.getDays();

    expect(response).rejects.toEqual({
      name: "NotFoundError",
      message: "No result for this search!",
    });
  });
});
