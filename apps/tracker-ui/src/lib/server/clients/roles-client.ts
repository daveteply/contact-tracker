'use server';

import { RoleCreateDto, RoleReadDto, RoleUpdateDto } from '@contact-tracker/api-models';
import { createGenericClient } from './common/create-generic-client';

const roleClient = createGenericClient<RoleReadDto, RoleCreateDto, RoleUpdateDto>('roles');

export const fetchRoles = roleClient.fetchAll;
export const fetchRoleById = roleClient.fetchById;
export const createRole = roleClient.create;
export const updateRole = roleClient.update;
export const deleteRole = roleClient.delete;
export const searchRoles = roleClient.search;
export const canDeleteRole = roleClient.canDelete;
