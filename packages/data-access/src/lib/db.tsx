'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import {
  CompanySchema,
  ContactSchema,
  EventSchema,
  EventTypeSchema,
  ReminderSchema,
  RoleSchema,
} from '@contact-tracker/document-model';
import { TrackerCollections, TrackerDatabase } from './repositories/types/common';

// Add dev mode in development
if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin);
}

const DatabaseContext = createContext<TrackerDatabase | null>(null);

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [db, setDb] = useState<TrackerDatabase | null>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    // Ensure this only runs in the browser and hasn't been initialized
    if (typeof window === 'undefined' || db || isInitializing.current) {
      return;
    }

    isInitializing.current = true;

    const initDB = async () => {
      try {
        const _db = await createRxDatabase<TrackerCollections>({
          name: 'contact_tracker_db',
          storage: wrappedValidateAjvStorage({
            storage: getRxStorageDexie(),
          }),
          ignoreDuplicate: true, // Useful for HMR in monorepos
        });

        await _db.addCollections({
          companies: { schema: CompanySchema },
          contacts: { schema: ContactSchema },
          events: { schema: EventSchema },
          eventTypes: { schema: EventTypeSchema },
          roles: { schema: RoleSchema },
          reminder: { schema: ReminderSchema },
        });

        setDb(_db);
      } catch (err) {
        console.error('Failed to initialize RxDB:', err);
        isInitializing.current = false;
      }
    };

    initDB();
  }, [db]);

  if (!db) {
    // TODO: explore using consistent loading component
    return <div>Initializing Local Database...</div>;
  }

  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>;
};

export const useDb = () => {
  const context = useContext(DatabaseContext);
  return context;
};
