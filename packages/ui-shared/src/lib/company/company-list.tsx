'use client';

import { ApiResult, CompanyReadDto } from '@contact-tracker/api-models';
// import { useToast } from '../common/toast-context';
// import { useRouter } from 'next/navigation';
import CompanyInfoCard from './company-info-card';

export interface CompanyListProps {
  companies: CompanyReadDto[];
  //onDeleteAction: (id: number) => Promise<ApiResult<CompanyReadDto[]>>;
}

export function CompanyList({ companies }: CompanyListProps) {
  // const router = useRouter();
  // const { showToast } = useToast();

  // function handleDelete(company: CompanyReadDto) {
  //   return async () => {
  //     // TODO: add confirm
  //     const result = await onDeleteAction(company.id);

  //     if (result.success) {
  //       showToast('Company deleted successfully!', 'success');
  //       router.push('/events/companies');
  //     } else {
  //       // TODO log this
  //       showToast('Could not delete Company', 'error');
  //     }
  //   };
  // }

  return (
    <div className="flex flex-col gap-3">
      {companies && companies.length ? (
        <>
          {companies.map((company: CompanyReadDto) => (
            <CompanyInfoCard key={company.id} company={company} />
          ))}
        </>
      ) : (
        <p>No companies found</p>
      )}
    </div>
  );
}

export default CompanyList;
