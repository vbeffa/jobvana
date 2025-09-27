import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import type { Company } from '../../Context';
import EditButtons from '../../controls/EditButtons';
import Error from '../../Error';
import UpdatingModal from '../../UpdatingModal';
import supabase from '../../utils/supabase';
import InterviewProcessDisplay from '../InterviewProcessDisplay';
import { isValidInterviewProcess } from '../utils';
import InterviewProcessEdit from './InterviewProcessEdit';
import { type InterviewProcess } from './utils';

export type MyCompanyInterviewProcessProps = {
  company: Company;
};

const MyCompanyInterviewProcess = ({
  company
}: MyCompanyInterviewProcessProps) => {
  const [editInterviewProcess, setEditInterviewProcess] =
    useState<InterviewProcess>(company.interview_process as InterviewProcess);
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
      const { error } = await supabase
        .from('companies')
        .update({
          ...company,
          interview_process: editInterviewProcess
        })
        .eq('id', company.id);
      // .select();

      if (error) {
        console.log(error);
        setError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [company, editInterviewProcess]);

  if (!company) {
    return;
  }

  return (
    <>
      {error && <Error error={error} />}
      {isSubmitting && <UpdatingModal />}
      <div className="grid grid-cols-[15%_75%] gap-y-2 relative">
        <EditButtons
          isEditing={isEditing}
          setIsEditing={(isEditing) => {
            if (isEditing) {
              setError(undefined);
            }
            setIsEditing(isEditing);
          }}
          disabled={isEditing && (!isDirty || !isValid || isSubmitting)}
          onEdit={() =>
            setEditInterviewProcess(
              company.interview_process as InterviewProcess
            )
          }
          onCancel={() => {
            setEditInterviewProcess(
              company.interview_process as InterviewProcess
            );
          }}
          onSave={() => {
            updateInterviewProcess();
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        {!isEditing && (
          <InterviewProcessDisplay interviewProcess={editInterviewProcess} />
        )}
        {isEditing && (
          <InterviewProcessEdit
            interviewProcess={editInterviewProcess}
            setInterviewProcess={setEditInterviewProcess}
          />
        )}
      </div>
    </>
  );
};

export default MyCompanyInterviewProcess;
