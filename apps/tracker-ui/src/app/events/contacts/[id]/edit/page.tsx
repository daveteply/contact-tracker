import { useCompanySearch, useContact, useContactMutations } from '@contact-tracker/data-access';
import { ContactForm, PageLoading } from '@contact-tracker/ui-components';
import Link from 'next/link';
import { use } from 'react';

export default async function ContactUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { contact, loading, error } = useContact(id);
  const { search } = useCompanySearch();
  const { update } = useContactMutations();

  if (loading) {
    return <PageLoading entityName="contact" />;
  }

  if (error || !contact) {
    return (
      <>
        <p className="mb-3">Contact not found</p>
        <Link className="btn" href="../">
          Back to Contacts
        </Link>
      </>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Contact</h1>
      <ContactForm
        onSubmitAction={(data) => update(id, data)}
        initialData={contact}
        onSearchCompany={search}
        isEdit={true}
      />
    </div>
  );
}
