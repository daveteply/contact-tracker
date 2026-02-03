'use server';

import { EventCreateDto, EventReadDto, EventUpdateDto } from '@contact-tracker/api-models';
import { createGenericClient } from './common/create-generic-client';

const eventClient = createGenericClient<EventReadDto, EventCreateDto, EventUpdateDto>('events');

export const fetchEvents = eventClient.fetchAll;
export const fetchEventById = eventClient.fetchById;
export const createEvent = eventClient.create;
export const updateEvent = eventClient.update;
export const deleteEvent = eventClient.delete;
export const searchEvents = eventClient.search;
