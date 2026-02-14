'use client';

import { CompanyDocumentDto } from '@contact-tracker/api-models';
import { TrackerDatabase } from '../db';

export const handleLocalCompanyUpdate =
  (db: TrackerDatabase, id: string) => async (data: CompanyDocumentDto) => {
    try {
      const doc = await db.companies
        .findOne({
          selector: { id: id },
        })
        .exec();

      if (!doc) {
        return { success: false, message: 'Company not found' };
      }

      await doc.incrementalPatch({
        ...data,
        updatedAt: new Date().toISOString(),
      });

      return { success: true, message: 'Company updated locally!' };
    } catch (error) {
      console.error('Local Update Error:', error);
      return { success: false, message: 'Failed to update in local database' };
    }
  };
