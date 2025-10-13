import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { CompanyContext, type Company } from '../../Context';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import supabase from '../../db/supabase';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
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
        setCompany(data[0] as Company);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [company.id, editCompany, setCompany, setError]);

  return (
    <div className="h-full">
      <div className="w-full bg-blue-200">
        <div className="relative pl-4 mr-4 h-7 flex flex-row gap-2 justify-end">
          <EditDeleteIcons
            isEditing={isEditing}
            disabled={isEditing && (!isDirty || !isValid || isSubmitting)}
            bgColor="--color-blue-200"
            top="top-1.25"
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
        </div>
      </div>
      {error && <JobvanaError error={error} />}
      {isSubmitting && <Modal type="updating" />}
      <div className="px-4 pt-4 relative grid grid-cols-[20%_80%] gap-y-2">
        {!isEditing && <CompanyOverviewDisplay company={editCompany} />}
        {isEditing && (
          <MyCompanyOverviewEdit
            company={editCompany}
            setCompany={setEditCompany}
          />
        )}
      </div>
    </div>
  );
};

export default MyCompanyOverview;
