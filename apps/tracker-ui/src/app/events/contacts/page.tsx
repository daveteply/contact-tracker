import { fetchContacts } from '@/lib/server/clients/contacts-client';
import { ContactReadDto } from '@contact-tracker/api-models';

export default async function Index() {
  const contacts = await fetchContacts();

  return (
    <div>
      <h1>Contacts</h1>
      {contacts && contacts.length > 0 ? (
        <ul>
          {contacts.map((contact: ContactReadDto) => (
            <li key={contact.id}>
              {contact.firstName} {contact.lastName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No contacts found</p>
      )}
    </div>
  );
}
