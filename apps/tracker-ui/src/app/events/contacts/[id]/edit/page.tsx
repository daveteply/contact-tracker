import { updateContactAction } from '@/lib/server/actions/contact-actions';
import { fetchContactById } from '@/lib/server/clients/contacts-client';
import { ContactForm } from '@contact-tracker/ui-shared';

export default async function ContactUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contactId = parseInt(id);
  const response = await fetchContactById(contactId);

  if (!response.success) {
    return <div>Contact not found</div>;
  }

  const boundUpdateAction = updateContactAction.bind(null, contactId);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Contact</h1>
      <ContactForm onSubmitAction={boundUpdateAction} initialData={response.data} isEdit={true} />
    </div>
  );
}
