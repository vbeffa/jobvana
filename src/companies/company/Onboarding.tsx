import { useCallback, useContext, useMemo, useState } from 'react';
import { JobvanaContext } from '../../Context';
import Button from '../../controls/Button';
import Error from '../../Error';
import TextArea from '../../inputs/TextArea';
import supabase from '../../utils/supabase';
import IndustrySelect from '../IndustrySelect';
import { MAX_DESCRIPTION_LENGTH } from '../job_seeker/useCompanies';
import { isValidCompany, type ToInsert } from '../utils';
import CompanyName from './CompanyName';
import CompanySize from './CompanySize';

const Onboarding = ({ userId }: { userId: string }) => {
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
    () => isSubmitting || !isValidCompany(newCompany),
    [isSubmitting, newCompany]
  );

  const addCompany = useCallback(async () => {
    if (!isValidCompany(newCompany)) {
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
        <div className="border-[0.5px] border-blue-300 rounded-lg w-[36rem]">
          <div className="m-4 grid grid-cols-[25%_75%] gap-y-2">
            <CompanyName name={newCompany.name} handleUpdate={setNewCompany} />
            <IndustrySelect
              showAll={false}
              showEmpty={true}
              handleUpdate={setNewCompany}
            />
            <CompanySize
              label="Num employees"
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
      </div>
    </>
  );
};

export default Onboarding;
