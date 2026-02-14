'use client';

import { CompanyDocumentDto } from '@contact-tracker/api-models';
import { TrackerDatabase } from '../db';

// Accept db as a parameter instead of calling a hook inside
export const handleLocalCompanyCreate =
  (db: TrackerDatabase) => async (data: CompanyDocumentDto) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = data;
      await db.companies.insert({
        id: crypto.randomUUID(),
        serverId: null, // Placeholder for [long Id]
        ...rest,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, message: 'Company created locally!' };
    } catch (error) {
      console.error('Local Insert Error:', error);
      return { success: false, message: 'Failed to save to local database' };
    }
  };
