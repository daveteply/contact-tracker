'use client';

import { CompanyCreateDto } from '@contact-tracker/api-models';
import { RxDatabase } from 'rxdb';

// Accept db as a parameter instead of calling a hook inside
export const handleLocalCompanyCreate = (db: RxDatabase) => async (data: CompanyCreateDto) => {
  try {
    await db.companies.insert({
      id: crypto.randomUUID(),
      serverId: null, // Placeholder for [long Id]
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return { success: true, message: 'Company created locally!' };
  } catch (error) {
    console.error('Local Insert Error:', error);
    return { success: false, message: 'Failed to save to local database' };
  }
};
