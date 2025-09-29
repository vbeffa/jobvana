import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { CompanyContext, type Company } from '../../Context';
import EditDeleteButtons from '../../controls/EditDeleteButtons';
import Error from '../../Error';
import UpdatingModal from '../../UpdatingModal';
import supabase from '../../utils/supabase';
import InterviewProcessDisplay from '../InterviewProcessDisplay';
import { isValidInterviewProcess } from '../utils';
import InterviewProcessEdit from './InterviewProcessEdit';
import { EMPTY_PROCESS, type InterviewProcess } from './utils';

export type MyCompanyInterviewProcessProps = {
  company: Company;
};

const MyCompanyInterviewProcess = ({
  company
}: MyCompanyInterviewProcessProps) => {
  const { setCompany } = useContext(CompanyContext);
  const [editInterviewProcess, setEditInterviewProcess] =
    useState<InterviewProcess>(
      (company.interview_process ?? EMPTY_PROCESS) as InterviewProcess
    );
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const isDirty = useMemo(
    () => !_.isEqual(company.interview_process, editInterviewProcess),
    [company.interview_process, editInterviewProcess]
  );

  const isValid = useMemo(
    () => isValidInterviewProcess(editInterviewProcess),
    [editInterviewProcess]
  );

  const updateInterviewProcess = useCallback(async () => {
    if (!isValidInterviewProcess(editInterviewProcess)) {
      return;
    }

    setIsSubmitting(true);
    setError(undefined);
    try {
      const toUpdate = {
        ...company,
        interview_process: editInterviewProcess
      };
      const { error } = await supabase
        .from('companies')
        .update(toUpdate)
        .eq('id', company.id);

      if (error) {
        console.log(error);
        setError(error);
      } else {
        setCompany(toUpdate);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [company, editInterviewProcess, setCompany]);

  return (
    <>
      {error && <Error error={error} />}
      {isSubmitting && <UpdatingModal />}
      <div className="grid grid-cols-[15%_75%] gap-y-2 relative">
        <EditDeleteButtons
          isEditing={isEditing}
          disabled={isEditing && (!isDirty || !isValid || isSubmitting)}
          onEdit={() => {
            setError(undefined);
            setEditInterviewProcess(
              (company.interview_process ?? EMPTY_PROCESS) as InterviewProcess
            );
            setIsEditing(true);
          }}
          onCancel={() => {
            setEditInterviewProcess(
              (company.interview_process ?? EMPTY_PROCESS) as InterviewProcess
            );
            setIsEditing(false);
          }}
          onSave={async () => {
            setIsEditing(false);
            await updateInterviewProcess();
          }}
        />
      </div>
      {!isEditing && (
        <InterviewProcessDisplay interviewProcess={editInterviewProcess} />
      )}
      {isEditing && (
        <InterviewProcessEdit
          interviewProcess={editInterviewProcess}
          setInterviewProcess={setEditInterviewProcess}
        />
      )}
    </>
  );
};

export default MyCompanyInterviewProcess;
