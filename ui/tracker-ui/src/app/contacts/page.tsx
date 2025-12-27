import { fetchContacts } from '@/lib/server/clients/dotnet-client';

export default async function Index() {
  const contacts = await fetchContacts();
  return (
    <div>
      <h1>Contacts</h1>
    </div>
  );
}
