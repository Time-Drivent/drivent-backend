import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError, unauthorizedError } from "@/errors";
import { cannotListActivitiesError } from "@/errors/cannot-list-activities";
import activityRepository from "@/repositories/activities-repository";
import { TicketStatus } from "@prisma/client";

async function getEventDays(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw cannotListActivitiesError();
  }

  const eventDays = await activityRepository.findEventDays();

  if (eventDays.length === 0) {
    throw notFoundError();
  }

  return eventDays;
}

async function getEvents(userId: number, eventDayId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
 
  if (!enrollment) {
    throw notFoundError();
  }
 
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  
  if (!ticket || ticket.status === "RESERVED") {
    throw notFoundError();
  }

  const events = await activityRepository.findEventsByEventsDayId(eventDayId);

  if (!events || events.length === 0) {
    throw notFoundError();
  }

  return events;
}

async function createActivityTicket(activityId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw unauthorizedError();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticket.status !== TicketStatus.PAID) throw notFoundError();

  const activity = await activityRepository.findActivityById(activityId);
  if (activity._count.Reservation >= activity.capacity) {
    throw notFoundError();
  }

  //check if user already has any activity scheduled
  const scheduledActivities = await activityRepository.findscheduledActivitiesByticketId(userId);

  if (scheduledActivities.length === 0) {
    return await activityRepository.createActivityTicket(activityId, ticket.id);
  }

  const sameDayActivities = scheduledActivities.filter((value) => {
    return value.Activity.dateId === activity.dateId;
  });

  let timeConflict = false;
  for (let i = 0; sameDayActivities.length > i; i++) {
    //check if time range is the same as another activity.
    const sameTime = (activity.startTime.getTime() === sameDayActivities[i].Activity.startTime.getTime());
    //check if startsAt is inside other activity time range
    const startsInMiddle = (activity.startTime.getTime() > sameDayActivities[i].Activity.startTime.getTime() && activity.startTime.getTime() < sameDayActivities[i].Activity.startTime.getTime());
    //check if endsAt is inside other activity time range
    const endsInMiddle = (activity.endTime.getTime() > sameDayActivities[i].Activity.endTime.getTime() && activity.endTime.getTime() < sameDayActivities[i].Activity.endTime.getTime());

    if (sameTime || startsInMiddle || endsInMiddle) {
      timeConflict = true;
      break;
    }
  }
  if (timeConflict) throw notFoundError;
  return await activityRepository.createActivityTicket(activityId, userId);
}

const activityService = {
  getEventDays,
  getEvents,
  createActivityTicket
};

export default activityService;
