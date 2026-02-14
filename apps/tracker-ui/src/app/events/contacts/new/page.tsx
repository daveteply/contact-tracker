import { createContactAction } from '@/lib/server/actions/contact-actions';
import { searchCompanies } from '@/lib/server/clients/companies-client';
import { ContactForm } from '@contact-tracker/ui-components';

export default async function CreateContactPage() {
  return (
    <div>
      <h1 className="text-xl">Contacts - new Contact</h1>
      <ContactForm onSubmitAction={createContactAction} onSearchCompany={searchCompanies} />
    </div>
  );
}
