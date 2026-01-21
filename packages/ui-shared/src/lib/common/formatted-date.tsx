'use client';

import { useEffect, useState } from 'react';

export interface FormattedDateProps {
  dateValue?: Date;
  showTime?: boolean;
}

export function FormattedDate({ dateValue, showTime = false }: FormattedDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !dateValue) return null;

  const date = new Date(dateValue);

  return (
    <span>
      {
        showTime
          ? date.toLocaleString() // Date and Time (e.g., "1/23/2026, 10:00:00 AM")
          : date.toLocaleDateString() // Date only (e.g., "1/23/2026")
      }
    </span>
  );
}

export default FormattedDate;
