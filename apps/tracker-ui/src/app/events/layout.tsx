export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Contract Tracker</h1>
        </div>
      </header>
      <main className="container mx-auto p-4 grow">{children}</main>
    </div>
  );
}
