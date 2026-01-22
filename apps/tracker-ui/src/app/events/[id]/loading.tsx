export default function EventDetailsLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <span className="mr-2">Loading Event</span>
        <span className="loading loading-bars loading-xs text-primary"></span>
      </div>
    </div>
  );
}
