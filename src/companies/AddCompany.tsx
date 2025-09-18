import { useCallback, useContext, useMemo, useState } from 'react';
import Button from '../Button';
import { JobvanaContext } from '../Context';
import Error from '../Error';
import TextArea from '../TextArea';
import TextInput from '../TextInput';
import type { Company } from '../types';
import supabase from '../utils/supabase';
import IndustrySelect from './IndustrySelect';
import SizeInput from './SizeInput';

type NewCompany =
  // Omit<Company, 'id' | 'created_at'>;
  {
    name?: string;
    industry_id?: number;
    description?: string;
    num_employees: number | '';
    user_id: string;
  };

const AddCompany = ({ userId }: { userId: string }) => {
  const { setCompany } = useContext(JobvanaContext);
  const [newCompany, setNewCompany] = useState<NewCompany>({
    // name: '',
    num_employees: '',
    // industry_id: -1,
    // description: '',
    user_id: userId
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const submitDisabled = useMemo(
    () =>
      isSubmitting ||
      !newCompany.name ||
      !newCompany.num_employees ||
      !newCompany.industry_id ||
      !newCompany.description,
    [
      newCompany.description,
      newCompany.industry_id,
      newCompany.name,
      newCompany.num_employees,
      isSubmitting
    ]
  );

  const addCompany = useCallback(async () => {
    if (
      !newCompany.name ||
      !newCompany.num_employees ||
      !newCompany.industry_id ||
      !newCompany.description
    ) {
      return;
    }
    const toInsert: Omit<Company, 'id' | 'created_at'> = {
      name: newCompany.name,
      num_employees: newCompany.num_employees,
      industry_id: newCompany.industry_id,
      description: newCompany.description,
      user_id: newCompany.user_id
    };
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .insert(toInsert)
        .select();
      console.log(data, error);
      if (error) {
        setError(error);
      } else {
        setCompany(data?.[0]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    newCompany.description,
    newCompany.industry_id,
    newCompany.name,
    newCompany.num_employees,
    newCompany.user_id,
    setCompany
  ]);

  return (
    <div className="w-[32rem]">
      <h1>Onboarding</h1>
      {error && <Error error={error} />}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <TextInput
          id="name"
          label="Name"
          autoComplete="organization"
          onChange={(name) =>
            setNewCompany((company) => ({
              ...company,
              name
            }))
          }
        />
        {/* <Section title="Optional"> */}
        <IndustrySelect
          id="industry"
          label="Industry"
          showAll={false}
          showEmpty={true}
          onChange={(industryId) =>
            setNewCompany((company) => ({
              ...company,
              industry_id: industryId ?? -1
            }))
          }
        />
        <SizeInput
          id="num_employees"
          label="Num employees"
          size={newCompany.num_employees}
          onChange={(size) =>
            setNewCompany((company) => ({
              ...company,
              num_employees: size
            }))
          }
        />
        <TextArea
          id="description"
          label="Description"
          onChange={(description) =>
            setNewCompany((company) => ({
              ...company,
              description
            }))
          }
        />
        {/* </Section> */}
        <div className="text-center col-span-3">
          <Button
            label="Continue"
            disabled={submitDisabled}
            onClick={addCompany}
          />
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
