import datesRepository from "@/repositories/date-repository";
import datesService from "@/services/dates-service";

describe("datesService.GetDates", () => {
  it("Should return dates when everything is ok", () => {
    jest.spyOn(datesRepository, "getDates").mockImplementationOnce((): any => {
      return [{ date: true }];
    });

    const response = datesService.getDates();

    expect(response).toEqual(expect.not.arrayContaining([expect.not.objectContaining({ date: true })]));
  });
  it("Should throw error when no dates are found", () => {
    jest.spyOn(datesRepository, "getDates").mockImplementationOnce((): any => {
      return [];
    });

    const response = datesService.getDates();

    expect(response).rejects.toEqual({
      name: "NotFoundError",
      message: "No result for this search!",
    });
  });
});
