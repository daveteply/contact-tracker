'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface EventActionMenuProps {
  id: number;
}

export function EventActionMenu({ id }: EventActionMenuProps) {
  const containerRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <details
      ref={containerRef}
      className="dropdown dropdown-end"
      open={isOpen}
      onToggle={(e) => setIsOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary
        className="btn btn-ghost btn-circle list-none"
        onClick={(e) => {
          if (isOpen) {
            e.preventDefault();
            setIsOpen(false);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M10.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
            clipRule="evenodd"
          />
        </svg>
      </summary>

      <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-40 p-2 shadow-lg border border-base-200">
        <li>
          <Link
            href={`/events/${id}/edit`}
            className="flex items-center gap-2 hover:bg-base-200"
            onClick={() => setIsOpen(false)} // Close menu after clicking action
          >
            Edit
          </Link>
        </li>
        <li>
          <Link
            href={`/events/${id}/delete`}
            className="flex items-center gap-2 text-error hover:bg-error/10"
            onClick={() => setIsOpen(false)} // Close menu after clicking link
          >
            Delete
          </Link>
        </li>
      </ul>
    </details>
  );
}

export default EventActionMenu;
