import { Company } from '@contact-tracker/api-models';

export interface CompanyListProps {
  companyList: Company[];
}

export function CompanyList(props: CompanyListProps) {
  return (
    <div>
      {props.companyList && props.companyList.length ? (
        <ul>
          {props.companyList.map((company: Company) => (
            <li key={company.name}>{company.name}</li>
          ))}
        </ul>
      ) : (
        <p>No companies found</p>
      )}
    </div>
  );
}

export default CompanyList;
