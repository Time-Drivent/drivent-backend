import activitiesRepository from "@/repositories/activities-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import activitiesService from "@/services/activities-service";

describe("activitiesService.GetDates", () => {
  it("Should return activity vacancy", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
      return {};
    });

    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
      return { status: "PAID" };
    });

    jest.spyOn(activitiesRepository, "findEventsByEventsDayId").mockImplementationOnce((): any => {
      return [
        {
          "id": 1,
          "name": "Minecraft: precisa montar o PC ideal?",
          "startTime": "2023-09-22T12:00:00.000Z",
          "endTime": "2023-09-22T13:00:00.000Z",
          "capacity": 1,
          "dateId": 1,
          "venueId": 1,
          "createdAt": "2023-03-18T01:31:09.378Z",
          "updatedAt": "2023-03-18T01:31:09.379Z",
          "Reservation": [],
          "Venue": {
            "id": 1,
            "name": "Auditório Principal",
            "createdAt": "2023-03-18T01:31:09.342Z",
            "updatedAt": "2023-03-18T01:31:09.343Z"
          },
          "Day": {
            "id": 1,
            "weekday": "Sexta",
            "date": "2023-10-22T03:00:00.000Z",
            "createdAt": "2023-03-18T01:31:09.359Z",
            "updatedAt": "2023-03-18T01:31:09.360Z"
          }
        }
      ];
    });

    const response = await activitiesService.getEvents(1, 1);

    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ capacity: 1 })
      ])
    );
  });

  it("Should return activity reservations", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => {
      return {};
    });

    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => {
      return { status: "PAID" };
    });

    jest.spyOn(activitiesRepository, "findEventsByEventsDayId").mockImplementationOnce((): any => {
      return [
        {
          "id": 1,
          "name": "Minecraft: precisa montar o PC ideal?",
          "startTime": "2023-09-22T12:00:00.000Z",
          "endTime": "2023-09-22T13:00:00.000Z",
          "capacity": 1,
          "dateId": 1,
          "venueId": 1,
          "createdAt": "2023-03-18T01:31:09.378Z",
          "updatedAt": "2023-03-18T01:31:09.379Z",
          "Reservation": [
            {
              "id": 5,
              "userId": 2
            }
          ],
          "Venue": {
            "id": 1,
            "name": "Auditório Principal",
            "createdAt": "2023-03-18T01:31:09.342Z",
            "updatedAt": "2023-03-18T01:31:09.343Z"
          },
          "Day": {
            "id": 1,
            "weekday": "Sexta",
            "date": "2023-10-22T03:00:00.000Z",
            "createdAt": "2023-03-18T01:31:09.359Z",
            "updatedAt": "2023-03-18T01:31:09.360Z"
          }
        }
      ];
    });

    const response = await activitiesService.getEvents(1, 1);

    expect(response).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "Reservation": expect.arrayContaining([
            expect.objectContaining({ "id": 5, "userId": 2 })
          ])
        })
      ])
    );
  });
});
