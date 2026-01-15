'use server';
import { ContactCreateDto, ContactReadDto, ContactUpdateDto } from '@contact-tracker/api-models';
import { createGenericClient } from './common/create-generic-client';

const contactClient = createGenericClient<ContactReadDto, ContactCreateDto, ContactUpdateDto>(
  'contacts',
);

export const fetchContacts = contactClient.fetchAll;
export const fetchContactById = contactClient.fetchById;
export const createContact = contactClient.create;
export const updateContact = contactClient.update;
export const deleteContact = contactClient.delete;
export const searchContacts = contactClient.search;
