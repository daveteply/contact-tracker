import { fetchContactById } from '@/lib/server/clients/contacts-client';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default async function ContactDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contactId = parseInt(id);
  const response = await fetchContactById(contactId);
  const contact = response.data;

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <>
      <div className="flex mb-3">
        <h1 className="text-xl pr-2">Contact Details</h1>
        <Link
          className="btn btn-circle btn-sm text-primary"
          href={`${contactId}/edit`}
          title="Edit Contact"
        >
          <PencilIcon className="size-5" />
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${contactId}/delete`}
          title="Delete Contact"
        >
          <TrashIcon className="size-5" />
        </Link>
      </div>

      {/* <ContactInfoCard contact={contact} showControls={false} /> */}

      <div className="mt-5">
        <Link className="btn mr-3" href="./">
          Back to Contacts
        </Link>
        <Link className="btn" href="../">
          Back to Events
        </Link>
      </div>
    </>
  );
}
