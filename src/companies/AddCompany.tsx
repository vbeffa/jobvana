import { useCallback, useContext, useMemo, useState } from 'react';
import Button from '../Button';
import { JobvanaContext } from '../Context';
import Error from '../Error';
import TextArea from '../TextArea';
import supabase from '../utils/supabase';
import CompanyName from './CompanyName';
import CompanySize from './CompanySize';
import IndustrySelect from './IndustrySelect';
import { MAX_DESCRIPTION_LENGTH } from './useCompanies';
import { isValid, type ToInsert } from './utils';

const AddCompany = ({ userId }: { userId: string }) => {
  const { setCompany } = useContext(JobvanaContext);
  const [newCompany, setNewCompany] = useState<Partial<ToInsert>>({
    name: '', // prevent "changing uncontrolled input to be controlled" error
    description: '',
    user_id: userId,
    industry_id: -1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const submitDisabled = useMemo(
    () => isSubmitting || !isValid(newCompany),
    [isSubmitting, newCompany]
  );

  const addCompany = useCallback(async () => {
    if (!isValid(newCompany)) {
      return;
    }
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert(newCompany as ToInsert)
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
  }, [newCompany, setCompany]);

  return (
    <>
      <h1>Onboarding</h1>
      {error && <Error error={error} />}
      <div className="mt-4 flex justify-center">
        <div className="grid grid-cols-[25%_75%] w-[32rem] gap-y-2">
          <CompanyName name={newCompany.name} handleUpdate={setNewCompany} />
          <IndustrySelect
            showAll={false}
            showEmpty={true}
            handleUpdate={setNewCompany}
          />
          <CompanySize
            size={newCompany.num_employees}
            handleUpdate={setNewCompany}
          />
          <TextArea
            id="description"
            label="Description"
            value={newCompany.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            onChange={(description) =>
              setNewCompany((company) => ({
                ...company,
                description
              }))
            }
          />
          <div className="text-center col-span-2 text-sm">
            All fields are required
          </div>
          <div className="text-center col-span-2">
            <Button
              label="Continue"
              disabled={submitDisabled}
              onClick={addCompany}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCompany;
