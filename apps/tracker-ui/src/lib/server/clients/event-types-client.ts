'use server';
import {
  EventTypeCreateDto,
  EventTypeReadDto,
  EventTypeUpdateDto,
} from '@contact-tracker/api-models';
import { createGenericClient } from './common/create-generic-client';

const eventtypeClient = createGenericClient<
  EventTypeReadDto,
  EventTypeCreateDto,
  EventTypeUpdateDto
>('event-types');

export const fetchEventTypes = eventtypeClient.fetchAll;
export const fetchContactById = eventtypeClient.fetchById;
export const createContact = eventtypeClient.create;
export const updateContact = eventtypeClient.update;
export const deleteContact = eventtypeClient.delete;
export const searchContacts = eventtypeClient.search;
