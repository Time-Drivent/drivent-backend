import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListActivitiesError } from "@/errors/cannot-list-activities";
import activityRepository from "@/repositories/activities-repository";
import { createClient } from "redis";
import { eventDayType } from "@/protocols";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

async function getEventDays(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw cannotListActivitiesError();
  }

  if (await redisClient.exists("activities")) {
    const cache = await redisClient.get("activities");
    return JSON.parse(cache);
  }

  const eventDays = await activityRepository.findEventDays();

  if (eventDays.length === 0) {
    throw notFoundError();
  }

  await redisClient.set("activities", JSON.stringify(eventDays));

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

  if (await redisClient.exists("eventsday")) {
    const cache = await redisClient.get("eventsday");
    const array = JSON.parse(cache);
    const eventDay = array.filter((value: eventDayType) => value.id === eventDayId);
    
    return eventDay[0].result;
  }

  const events = await activityRepository.findEventsByEventsDayId(eventDayId);
  if (!events || events.length === 0) {
    throw notFoundError();
  }
  
  const eventDay = await activityRepository.findEventDays();
  const eventDayIds = eventDay.map((value: { id: unknown; }) => value.id);
  
  const activities = await Promise.all(eventDayIds.map(async (value: number) =>  {
    const result = await activityRepository.findEventsByEventsDayId(value);
    return { id: value, result };
  }
  ));

  await redisClient.set("eventsday", JSON.stringify(activities));

  return events;
}

const activityService = {
  getEventDays,
  getEvents,
};

export default activityService;
