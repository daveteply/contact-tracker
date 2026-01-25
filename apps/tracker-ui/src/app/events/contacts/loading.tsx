export default function ContactListPageLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <span className="mr-2">Loading Contacts</span>
        <span className="loading loading-bars loading-xs text-primary"></span>
      </div>
    </div>
  );
}
