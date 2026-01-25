'use server';

import { CompanyCreateDto, CompanyReadDto, CompanyUpdateDto } from '@contact-tracker/api-models';
import { createGenericClient } from './common/create-generic-client';

const companyClient = createGenericClient<CompanyReadDto, CompanyCreateDto, CompanyUpdateDto>(
  'companies',
);

export const fetchCompanies = companyClient.fetchAll;
export const fetchCompanyById = companyClient.fetchById;
export const createCompany = companyClient.create;
export const updateCompany = companyClient.update;
export const deleteCompany = companyClient.delete;
export const searchCompanies = companyClient.search;
export const canDeleteCompany = companyClient.canDelete;
