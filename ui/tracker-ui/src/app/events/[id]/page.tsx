import EventForm from '../components/event-form';

export default async function Index({ id }: { id: number }) {
  return <EventForm mode="edit" id={id}></EventForm>;
}
