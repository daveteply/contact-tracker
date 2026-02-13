'use client';

import { RxDatabase } from 'rxdb';

// Delete a company from RxDB
export const handleLocalCompanyDelete = (db: RxDatabase, id: string) => async () => {
  try {
    // Find the document by ID
    const doc = await db.companies
      .findOne({
        selector: { id: id },
      })
      .exec();

    if (!doc) {
      return { success: false, message: 'Company not found' };
    }

    // Remove the document
    await doc.remove();

    return { success: true, message: 'Company deleted locally!' };
  } catch (error) {
    console.error('Local Delete Error:', error);
    return { success: false, message: 'Failed to delete from local database' };
  }
};
