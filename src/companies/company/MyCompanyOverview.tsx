import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { JobvanaContext, type Company } from '../../Context';
import EditButtons from '../../controls/EditButtons';
import Error from '../../Error';
import TextArea from '../../inputs/TextArea';
import UpdatingModal from '../../UpdatingModal';
import supabase from '../../utils/supabase';
import CompanyEmailDisplay from '../CompanyEmailDisplay';
import IndustrySelect from '../IndustrySelect';
import { MAX_DESCRIPTION_LENGTH } from '../job_seeker/useCompanies';
import useIndustries from '../useIndustries';
import { isValidCompany, type ToUpdate } from '../utils';
import CompanyEmail from './CompanyEmail';
import CompanyName from './CompanyName';
import CompanySize from './CompanySize';

export type MyCompanyMainProps = {
  company: Company;
};

const MyCompanyOverview = ({ company }: MyCompanyMainProps) => {
  const { setCompany } = useContext(JobvanaContext);
  const { findIndustry } = useIndustries();
  const [editCompany, setEditCompany] = useState<ToUpdate>(company);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const isDirty = useMemo(
    () => !_.isEqual(company, editCompany),
    [company, editCompany]
  );

  const isValid = useMemo(() => isValidCompany(editCompany), [editCompany]);

  const updateCompany = useCallback(async () => {
    if (!isValidCompany(editCompany)) {
      return;
    }
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(editCompany)
        .eq('id', company.id)
        .select();

      if (error) {
        console.log(error);
        setError(error);
      } else {
        // console.log(data);
        setCompany(data?.[0]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [company.id, editCompany, setCompany, setError]);

  return (
    <>
      {error && <Error error={error} />}
      {isSubmitting && <UpdatingModal />}
      <div className="grid grid-cols-[20%_65%] gap-y-2 relative">
        <EditButtons
          isEditing={isEditing}
          setIsEditing={(isEditing) => {
            if (isEditing) {
              setError(undefined);
            }
            setIsEditing(isEditing);
          }}
          disabled={isEditing && (!isDirty || !isValid || isSubmitting)}
          onEdit={() => setEditCompany(company)}
          onSave={updateCompany}
        />
        {!isEditing && (
          <>
            <div>Name:</div>
            <div>{company.name}</div>
            <div>Industry:</div>
            <div>{findIndustry(company.industry_id)?.name}</div>
            <div>Num employees:</div>
            <div>{company.num_employees}</div>
            <div>Contact email:</div>
            <div>
              <CompanyEmailDisplay {...company} />
            </div>
            <div>Description:</div>
            <div>{company.description}</div>
          </>
        )}
        {isEditing && (
          <>
            <CompanyName
              name={editCompany.name}
              handleUpdate={setEditCompany}
            />
            <IndustrySelect
              industryId={editCompany.industry_id}
              showAll={false}
              handleUpdate={setEditCompany}
            />
            <CompanySize
              label="Num employees"
              size={editCompany.num_employees}
              handleUpdate={setEditCompany}
            />
            <CompanyEmail
              email={editCompany.contact_email ?? undefined}
              handleUpdate={setEditCompany}
            />
            <TextArea
              id="description"
              label="Description"
              value={editCompany.description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              onChange={(description) =>
                setEditCompany((editCompany) => ({
                  ...editCompany,
                  description
                }))
              }
            />
          </>
        )}
      </div>
    </>
  );
};

export default MyCompanyOverview;
