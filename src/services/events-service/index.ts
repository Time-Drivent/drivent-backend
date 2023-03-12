import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import dayjs from "dayjs";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.connect();

async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cachedEvent = await redis.get("event");
  if (cachedEvent) {
    return exclude(JSON.parse(cachedEvent) as Event, "createdAt", "updatedAt");
  } else {
    const event = await eventRepository.findFirst();
    if (!event) throw notFoundError();
    await redis.set("event", JSON.stringify(event));

    return exclude(event, "createdAt", "updatedAt");
  }
}

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function isCurrentEventActive(): Promise<boolean> {
  const cachedEvent = await redis.get("event");
  if (cachedEvent) {
    const now = dayjs();
    const eventStartsAt = dayjs(JSON.parse(cachedEvent).startsAt);
    const eventEndsAt = dayjs(JSON.parse(cachedEvent).endsAt);

    return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
  } else {
    const event = await eventRepository.findFirst();
    if (!event) return false;
    await redis.set("event", JSON.stringify(event));

    const now = dayjs();
    const eventStartsAt = dayjs(event.startsAt);
    const eventEndsAt = dayjs(event.endsAt);

    return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
  }
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
