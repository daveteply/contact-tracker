import { fetchContacts } from '@/lib/server/clients/contacts-client';

export default async function Index() {
  const res = await fetchContacts();

  return (
    <div>
      <h1>Contacts</h1>
      {res.data && res.data.length > 0 ? (
        <ul>
          {res.data.map((contact: any) => (
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
