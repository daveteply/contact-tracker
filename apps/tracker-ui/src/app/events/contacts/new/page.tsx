import { createContactAction } from '@/lib/server/actions/contact-actions';
import { ContactForm } from '@contact-tracker/ui-shared';

export default async function CreateContactPage() {
  return (
    <div>
      <h1 className="text-xl">Contacts - new Contact</h1>
      <ContactForm onSubmitAction={createContactAction} />
    </div>
  );
}
