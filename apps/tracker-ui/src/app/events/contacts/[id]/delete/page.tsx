import { fetchContactById } from '@/lib/server/clients/contacts-client';

export default async function ContactDeletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contactId = parseInt(id);

  const result = await fetchContactById(contactId);
  const contact = result.data;

  // const canDelete = await canDeleteContact(contactId);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl pr-1">Contact - Delete</h1>
      {contact ? (
        <>
          {/* <ContactInfoCard contact={contact} showControls={false} /> */}
          {/* {canDelete ? (
            <EntityDelete
              id={contact.id}
              entityName="contact"
              postActionRoute="/events/contacts"
              onDeleteAction={deleteContact}
            />
          ) : (
            <>
              <p>This Contact is associated with Events and cannot be deleted</p>
              <Link className="btn" href="../">
                Back to Contacts
              </Link>
              <Link className="btn" href="../../">
                Back to Events
              </Link>
            </>
          )} */}
        </>
      ) : (
        <div>Contact Not Found</div>
      )}
    </div>
  );
}
