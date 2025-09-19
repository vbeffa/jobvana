import { useCallback, useContext, useMemo, useState } from 'react';
import Button from '../Button';
import { JobvanaContext, type Company } from '../Context';
import Error from '../Error';
import TextArea from '../TextArea';
import supabase from '../utils/supabase';
import CompanyName from './CompanyName';
import CompanySize from './CompanySize';
import IndustrySelect from './IndustrySelect';
import { MAX_DESCRIPTION_LENGTH } from './useCompanies';
import { isValid, type ToUpdate } from './utils';

const EditCompany = ({ company }: { company: Company }) => {
  const { setCompany } = useContext(JobvanaContext);
  const [editCompany, setEditCompany] = useState<ToUpdate>(company);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const submitDisabled = useMemo(
    () => isSubmitting || !isValid(editCompany),
    [editCompany, isSubmitting]
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
        setCompany(data?.[0]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [company.id, editCompany, setCompany]);

  return (
    <>
      {error && <Error error={error} />}
      <div className="flex justify-center">
        <div className="mt-4 grid grid-cols-[25%_75%] w-[32rem] gap-4">
          <CompanyName name={editCompany.name} handleUpdate={setEditCompany} />
          <IndustrySelect
            industryId={editCompany.industry_id}
            showAll={false}
            handleUpdate={setEditCompany}
          />
          <CompanySize
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
          <div className="text-center col-span-2">
            <Button
              label="Continue"
              disabled={submitDisabled}
              onClick={updateCompany}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCompany;
