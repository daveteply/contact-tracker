'use client';

import { useEffect, useState } from 'react';

export interface FormattedDateProps {
  dateValue?: Date;
  useRelativeTime?: boolean;
}

export function FormattedDate({ dateValue, useRelativeTime = true }: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !dateValue) return null;

  const eventDate = new Date(dateValue);
  if (useRelativeTime) {
    const currentDate = new Date();
    const differenceInMs = eventDate.getTime() - currentDate.getTime();
    // A day has 86,400,000 milliseconds (1000 * 60 * 60 * 24)
    const differenceInDays = Math.round(differenceInMs / 86400000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const formattedTime = rtf.format(differenceInDays, 'day');
    return <span>{formattedTime}</span>;
  }

  return (
    <span>
      {
        eventDate.toLocaleDateString() // Date only (e.g., "1/23/2026")
      }
    </span>
  );
}

export default FormattedDate;
