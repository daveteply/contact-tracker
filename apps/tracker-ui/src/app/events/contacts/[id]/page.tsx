import { fetchContactById } from '@/lib/server/clients/contacts-client';
import { ContactInfoCard } from '@contact-tracker/ui-shared';
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
        <Link className="btn btn-circle btn-sm" href={`${contactId}/edit`} title="Edit Contact">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
          </svg>
        </Link>
        <Link
          className="btn btn-circle btn-sm text-error"
          href={`${contactId}/delete`}
          title="Delete Contact"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      <ContactInfoCard contact={contact} showControls={false} />

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
