'use client';

import { createContext, useContext, useMemo } from 'react';
import { CompanyService, ContactService } from '../services';
import { CompanyRepository, ContactRepository, useDb } from '@contact-tracker/data-access';

interface AppServices {
  companyService: CompanyService;
  contactService: ContactService;
}

const ServiceContext = createContext<AppServices | null>(null);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = useDb();

  const services = useMemo(() => {
    if (!db) {
      return null;
    }

    const companyRepository = new CompanyRepository(db);
    const contactRepository = new ContactRepository(db);

    const companyService = new CompanyService(companyRepository);
    const contactService = new ContactService(contactRepository);

    return {
      companyService,
      contactService,
    };
  }, [db]);

  if (!services) {
    // Or a loading spinner
    return null;
  }

  return <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>;
};

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
