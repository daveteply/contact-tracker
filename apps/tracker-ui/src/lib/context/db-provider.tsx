'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import {
  CompanySchema,
  ContactSchema,
  EventSchema,
  EventTypeSchema,
  ReminderSchema,
  RoleSchema,
} from '@contact-tracker/rxdb-schema';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { PageLoading } from '@contact-tracker/ui-shared';

// Add dev mode in development
if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin);
}

const DatabaseContext = createContext<any>(null);

export const DatabaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [db, setDb] = useState<any>(null);
  const initializingRef = React.useRef(false);

  useEffect(() => {
    // Ensure this only runs in the browser
    if (typeof window === 'undefined' || db || initializingRef.current) return;

    // Logic to prevent double-initialization in React Strict Mode
    if (db) return;

    const initDB = async () => {
      try {
        const _db = await createRxDatabase({
          name: 'contact_tracker_db',
          storage: wrappedValidateAjvStorage({
            storage: getRxStorageDexie(),
          }),
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
        initializingRef.current = false;
        console.error(err);
      }
    };

    initDB();
  }, [db]);

  if (!db) return <PageLoading entityName="Initializing Local Database" />;

  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>;
};

export const useDb = () => useContext(DatabaseContext);
