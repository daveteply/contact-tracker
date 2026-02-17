'use client';

import { useCompanySearch, useContactMutations } from '@contact-tracker/data-access';
import { ContactForm } from '@contact-tracker/ui-components';

export default function CreateContactPage() {
  const { create } = useContactMutations();
  const { search } = useCompanySearch();

  return (
    <div>
      <h1 className="text-xl">Contacts - new Contact</h1>
      <ContactForm onSubmitAction={create} onSearchCompany={search} />
    </div>
  );
}
