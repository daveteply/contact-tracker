'use client';

import { searchCompanies } from '@/lib/server/clients/companies-client';
import { useContactMutations } from '@contact-tracker/data-access';
import { ContactForm } from '@contact-tracker/ui-components';

export default function CreateContactPage() {
  const { create } = useContactMutations();

  return (
    <div>
      <h1 className="text-xl">Contacts - new Contact</h1>
      <ContactForm onSubmitAction={create} onSearchCompany={searchCompanies} />
    </div>
  );
}
