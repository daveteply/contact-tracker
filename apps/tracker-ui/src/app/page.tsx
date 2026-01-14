import Link from 'next/link';

export default function Index() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Contact Tracker</h1>
          <p className="py-6">
            A job seeker tracking tool. Let's get you on your way to your next dream gig!
          </p>
          <Link className="btn btn-primary" href="/events">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
