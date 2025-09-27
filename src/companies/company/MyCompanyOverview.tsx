import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { JobvanaContext, type Company } from '../../Context';
import EditButtons from '../../controls/EditButtons';
import Error from '../../Error';
import UpdatingModal from '../../UpdatingModal';
import supabase from '../../utils/supabase';
import { isValidCompany, type ToUpdate } from '../utils';
import CompanyOverviewDisplay from './CompanyOverviewDisplay';
import MyCompanyOverviewEdit from './MyCompanyOverviewEdit';

export type MyCompanyMainProps = {
  company: Company;
};

const MyCompanyOverview = ({ company }: MyCompanyMainProps) => {
  const { setCompany } = useContext(JobvanaContext);
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
      <div className="grid grid-cols-[20%_65%] gap-y-2 relative border">
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
        {!isEditing && <CompanyOverviewDisplay company={company} />}
        {isEditing && (
          <MyCompanyOverviewEdit
            company={editCompany}
            setCompany={setEditCompany}
          />
        )}
      </div>
    </>
  );
};

export default MyCompanyOverview;
