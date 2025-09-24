import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { JobvanaContext, type Company } from '../../Context';
import EditButtons from '../../controls/EditButtons';
import Error from '../../Error';
import TextArea from '../../inputs/TextArea';
import supabase from '../../utils/supabase';
import IndustrySelect from '../IndustrySelect';
import { MAX_DESCRIPTION_LENGTH } from '../job_seeker/useCompanies';
import useIndustries from '../useIndustries';
import { isValid, type ToUpdate } from '../utils';
import CompanyName from './CompanyName';
import CompanySize from './CompanySize';

export type MyCompanyMainProps = {
  company: Company;
};

const MyCompanyOverview = ({ company }: MyCompanyMainProps) => {
  const { setCompany } = useContext(JobvanaContext);
  const { findIndustry } = useIndustries();
  const [editCompany, setEditCompany] = useState<ToUpdate>(company);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const isDirty = useMemo(
    () => !_.isEqual(company, editCompany),
    [company, editCompany]
  );

  const updateCompany = useCallback(async () => {
    if (!isValid(editCompany)) {
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
        console.log(data);
        setCompany(data?.[0]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [company.id, editCompany, setCompany, setError]);

  return (
    <>
      {error && <Error error={error} />}
      <div className="grid grid-cols-[20%_65%] gap-y-2 relative">
        <EditButtons
          editMode={editMode}
          setEditMode={setEditMode}
          disabled={editMode && (!isValid || !isDirty || isSubmitting)}
          onEdit={() => setEditCompany(company)}
          onSave={updateCompany}
        />
        {editMode && (
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
        {!editMode && (
          <>
            <div>Name:</div>
            <div>{company.name}</div>
            <div>Industry:</div>
            <div>{findIndustry(company.industry_id)?.name}</div>
            <div>Num employees:</div>
            <div>{company.num_employees}</div>
            <div>Description:</div>
            <div>{company.description}</div>
          </>
        )}
      </div>
    </>
  );
};

export default MyCompanyOverview;
