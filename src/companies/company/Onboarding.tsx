import { useCallback, useContext, useMemo, useState } from 'react';
import { getSession } from '../../auth/utils';
import { CompanyContext } from '../../Context';
import Button from '../../controls/Button';
import supabase from '../../db/supabase';
import Error from '../../Error';
import { isValidCompany, type ToInsert } from '../utils';
import MyCompanyOverviewEdit from './MyCompanyOverviewEdit';
import { EMPTY_PROCESS } from './utils';

const Onboarding = ({ userId }: { userId: string }) => {
  const { setCompany } = useContext(CompanyContext);
  const session = getSession();
  const [newCompany, setNewCompany] = useState<ToInsert>({
    name: '',
    description: '',
    num_employees: 1,
    contact_email: session?.user.email ?? '',
    user_id: userId,
    industry_id: -1,
    interview_process: EMPTY_PROCESS
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
        setCompany(data[0]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [newCompany, setCompany]);

  return (
    <>
      <h1>Onboarding</h1>
      {error && <Error error={error} />}
      <div className="flex justify-center">
        <div className="border-[0.5px] border-blue-300 rounded-lg w-[36rem]">
          <div className="m-4 grid grid-cols-[25%_75%] gap-y-2">
            <MyCompanyOverviewEdit
              company={newCompany}
              setCompany={setNewCompany}
              isOnboarding={true}
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
