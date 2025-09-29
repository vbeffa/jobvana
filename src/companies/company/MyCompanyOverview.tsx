import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { CompanyContext, type Company } from '../../Context';
import EditDeleteButtons from '../../controls/EditDeleteButtons';
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
  const { setCompany } = useContext(CompanyContext);
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
        setCompany(data[0]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [company.id, editCompany, setCompany, setError]);

  return (
    <>
      {error && <Error error={error} />}
      {isSubmitting && <UpdatingModal />}
      <div className="relative grid grid-cols-[20%_65%] gap-y-2">
        <EditDeleteButtons
          isEditing={isEditing}
          disabled={isEditing && (!isDirty || !isValid || isSubmitting)}
          onEdit={() => {
            setError(undefined);
            setEditCompany(company);
            setIsEditing(true);
          }}
          onCancel={() => {
            setEditCompany(company);
            setIsEditing(false);
          }}
          onSave={async () => {
            setIsEditing(false);
            await updateCompany();
          }}
        />
        {!isEditing && <CompanyOverviewDisplay company={editCompany} />}
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
