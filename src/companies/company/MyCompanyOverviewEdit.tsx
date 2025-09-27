import TextArea from '../../inputs/TextArea';
import IndustrySelect from '../IndustrySelect';
import { MAX_DESCRIPTION_LENGTH } from '../job_seeker/useCompanies';
import { type ToUpdate } from '../utils';
import CompanyEmail from './CompanyEmail';
import CompanyName from './CompanyName';
import CompanySize from './CompanySize';

export type MyCompanyOverviewEditProps = {
  company: ToUpdate;
  setCompany: React.Dispatch<React.SetStateAction<ToUpdate>>;
};

const MyCompanyOverviewEdit = ({
  company,
  setCompany
}: MyCompanyOverviewEditProps) => {
  return (
    <>
      <CompanyName name={company.name} handleUpdate={setCompany} />
      <IndustrySelect
        industryId={company.industry_id}
        showAll={false}
        handleUpdate={setCompany}
      />
      <CompanySize
        label="Num employees"
        size={company.num_employees}
        handleUpdate={setCompany}
      />
      <CompanyEmail
        email={company.contact_email ?? undefined}
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
