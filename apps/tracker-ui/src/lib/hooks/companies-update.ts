'use client';

import { CompanyUpdateDto } from '@contact-tracker/api-models';
import { RxDatabase } from 'rxdb';

export const handleLocalCompanyUpdate =
  (db: RxDatabase, id: string) => async (data: CompanyUpdateDto) => {
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
