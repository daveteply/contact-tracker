'use client';

import { CompanyReadDto } from '@contact-tracker/api-models';
import Link from 'next/link';
import { useToast } from '../ToastContext';
import { useRouter } from 'next/navigation';

export interface CompanyListProps {
  companies: CompanyReadDto[];
  onDeleteAction: (id: number) => Promise<any>;
}

export function CompanyList({ companies, onDeleteAction }: CompanyListProps) {
  const router = useRouter();
  const { showToast } = useToast();

  function handleDelete(company: CompanyReadDto) {
    return async () => {
      // TODO: add confirm
      const result = await onDeleteAction(company.id);

      if (result.success) {
        showToast('Company deleted successfully!', 'success');
        router.push('/events/companies');
      } else {
        // TODO log this
        showToast('Could not delete Company', 'error');
      }
    };
  }

  return (
    <div className="mt-5 flex flex-wrap">
      {companies && companies.length ? (
        <>
          {companies.map((company: CompanyReadDto) => (
            <div
              key={company.id}
              className="card bg-neutral text-neutral-content w-64 shadow-sm mb-3 mr-3"
            >
              <div className="card-body">
                <h3 className="card-title">{company.name}</h3>
                <ul>
                  <li>
                    {company.website && (
                      <a
                        className="link flex"
                        target="_blank"
                        rel="noreferrer"
                        href={company.website}
                      >
                        {company.website}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="size-4 ml-1"
                        >
                          <path d="M6.22 8.72a.75.75 0 0 0 1.06 1.06l5.22-5.22v1.69a.75.75 0 0 0 1.5 0v-3.5a.75.75 0 0 0-.75-.75h-3.5a.75.75 0 0 0 0 1.5h1.69L6.22 8.72Z" />
                          <path d="M3.5 6.75c0-.69.56-1.25 1.25-1.25H7A.75.75 0 0 0 7 4H4.75A2.75 2.75 0 0 0 2 6.75v4.5A2.75 2.75 0 0 0 4.75 14h4.5A2.75 2.75 0 0 0 12 11.25V9a.75.75 0 0 0-1.5 0v2.25c0 .69-.56 1.25-1.25 1.25h-4.5c-.69 0-1.25-.56-1.25-1.25v-4.5Z" />
                        </svg>
                      </a>
                    )}
                  </li>
                  <li>{company.industry}</li>
                  <li>{company.sizeRange}</li>
                  <li>{company.notes}</li>
                </ul>
                <div className="card-actions justify-center">
                  <Link
                    className="btn btn-primary"
                    href={`/events/companies/${company.id}/edit`}
                  >
                    Edit
                  </Link>
                  <button className="btn" onClick={handleDelete(company)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>No companies found</p>
      )}
    </div>
  );
}

export default CompanyList;
