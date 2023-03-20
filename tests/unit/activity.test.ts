import activityService from "@/services/activities-service";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { cannotListActivitiesError, notFoundError, unauthorizedError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import activityRepository from "@/repositories/activities-repository";

describe("activityService.getEventDays", () => {
  it("if enrollment is undefined", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => undefined);
    const promise = activityService.getEventDays(0);
    expect(promise).rejects.toEqual(notFoundError());
  });

  it("if ticket is undefined", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => true);
    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => undefined);
    const promise = activityService.getEventDays(0);
    expect(promise).rejects.toEqual(cannotListActivitiesError());
  });

  it("if event.length is equal 0", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => true);
    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => true);
    jest.spyOn(activityRepository, "findEventDays").mockImplementationOnce((): any => []);
    const promise = activityService.getEventDays(0);
    expect(promise).rejects.toEqual(notFoundError());
  });

  it("if there is an event", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => true);
    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => true);
    const days = [{
      "id": 1,
      "weekday": "Sexta",
      "date": ""
    }];
    jest.spyOn(activityRepository, "findEventDays").mockImplementationOnce((): any => {
      return days;
    });
    const eventDay = await activityService.getEventDays(0);
    expect(eventDay).toEqual(days);
  });
});

describe("activityService.createActivityTicket", () => {
  it("if enrollment is undefined", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => undefined);
    const promise = activityService.createActivityTicket(0, 0);
    expect(promise).rejects.toEqual(unauthorizedError());
  });
  
  it("if ticket.status is not PAID", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => true);
    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => ({ status: "RESERVED" }));
    const promise = activityService.createActivityTicket(0, 0);
    expect(promise).rejects.toEqual(notFoundError());
  });
  
  it("if no vacancy", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => true);
    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => ({ status: "PAID" }));
    jest.spyOn(activityRepository, "findActivityById").mockImplementationOnce((): any => ({
      _count: {
        Reservation: 1
      },
      capacity: 1
    }));
    const promise = activityService.createActivityTicket(0, 0);
    expect(promise).rejects.toEqual(notFoundError());
  });
  
  it("if there is no schedule", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => true);
    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => ({ status: "PAID" }));
    jest.spyOn(activityRepository, "findActivityById").mockImplementationOnce((): any => ({
      _count: {
        Reservation: 1
      },
      capacity: 2
    }));
    jest.spyOn(activityRepository, "findscheduledActivitiesByticketId").mockImplementationOnce((): any => []);
    jest.spyOn(activityRepository, "createActivityTicket").mockImplementationOnce((): any => ({}));
    const promise = await activityService.createActivityTicket(0, 0);
    expect(promise).toEqual({});
  });

  it("if there is a time conflict", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => true);
    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => ({ status: "PAID" }));
    const now = new Date();
    jest.spyOn(activityRepository, "findActivityById").mockImplementationOnce((): any => ({
      dateId: 1,
      _count: {
        Reservation: 1
      },
      capacity: 2,
      startTime: now,
      endTime: now
    }));

    const schedule = {
      Activity: {
        dateId: 1,
        startTime: now,
        endTime: now
      }
    };
    jest.spyOn(activityRepository, "findscheduledActivitiesByticketId").mockImplementationOnce((): any => [schedule]);
 
    const promise = activityService.createActivityTicket(0, 0);
    expect(promise).rejects.toEqual(notFoundError);
  });

  it("if there is not a time conflict", async () => {
    jest.spyOn(enrollmentRepository, "findWithAddressByUserId").mockImplementationOnce((): any => true);
    jest.spyOn(ticketRepository, "findTicketByEnrollmentId").mockImplementationOnce((): any => ({ status: "PAID" }));
    let now = new Date();
    jest.spyOn(activityRepository, "findActivityById").mockImplementationOnce((): any => ({
      dateId: 1,
      _count: {
        Reservation: 1
      },
      capacity: 2,
      startTime: now,
      endTime: now
    }));
    now = new Date();
    const schedule = {
      Activity: {
        dateId: 2,
        startTime: now,
        endTime: now
      }
    };
    jest.spyOn(activityRepository, "findscheduledActivitiesByticketId").mockImplementationOnce((): any => [schedule]);
    jest.spyOn(activityRepository, "createActivityTicket").mockImplementationOnce((): any => ({}));
    const promise = await activityService.createActivityTicket(0, 0);
    expect(promise).toEqual({});
  });
});
  
