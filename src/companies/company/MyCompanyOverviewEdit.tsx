import TextArea from '../../inputs/TextArea';
import IndustrySelect from '../IndustrySelect';
import { MAX_DESCRIPTION_LENGTH } from '../job_seeker/useCompanies';
import { type ToInsert, type ToUpdate } from '../utils';
import CompanyEmail from './CompanyEmail';
import CompanyName from './CompanyName';
import CompanySizeEdit from './CompanySizeEdit';

export type MyCompanyOverviewEditProps<T extends ToUpdate | Partial<ToInsert>> =
  {
    company: T;
    setCompany: React.Dispatch<React.SetStateAction<T>>;
    isOnboarding?: boolean;
  };

const MyCompanyOverviewEdit = <T extends ToUpdate | Partial<ToInsert>>({
  company,
  setCompany,
  isOnboarding
}: MyCompanyOverviewEditProps<T>) => {
  return (
    <>
      <CompanyName name={company.name} handleUpdate={setCompany} />
      <IndustrySelect
        industryId={company.industry_id}
        showAll={false}
        showEmpty={isOnboarding}
        handleUpdate={setCompany}
      />
      <CompanySizeEdit size={company.num_employees} handleUpdate={setCompany} />
      <CompanyEmail
        email={company.contact_email ?? ''}
        handleUpdate={setCompany}
      />
      <TextArea
        id="description"
        label="Description"
        value={company.description}
        maxLength={MAX_DESCRIPTION_LENGTH}
        onChange={(description) =>
          setCompany((company) => ({
            ...company,
            description
          }))
        }
      />
    </>
  );
};

export default MyCompanyOverviewEdit;
