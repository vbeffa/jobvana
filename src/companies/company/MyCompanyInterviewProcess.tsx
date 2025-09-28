import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import { JobvanaContext, type Company } from '../../Context';
import EditButtons from '../../controls/EditButtons';
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
  const { setCompany } = useContext(JobvanaContext);
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
              (company.interview_process ?? EMPTY_PROCESS) as InterviewProcess
            )
          }
          onCancel={() => {
            setEditInterviewProcess(
              (company.interview_process ?? EMPTY_PROCESS) as InterviewProcess
            );
          }}
          onSave={() => {
            updateInterviewProcess();
          }}
        />
      </div>
      {!isEditing && (
        <div className="border-[0.5px] border-blue-300 rounded-lg w-[600px] p-2 flex flex-col gap-2">
          <InterviewProcessDisplay interviewProcess={editInterviewProcess} />
        </div>
      )}
      {isEditing && (
        <div className="border-[0.5px] border-blue-300 rounded-lg w-[720px] p-2 flex flex-col gap-2">
          <InterviewProcessEdit
            interviewProcess={editInterviewProcess}
            setInterviewProcess={setEditInterviewProcess}
          />
        </div>
      )}
    </>
  );
};

export default MyCompanyInterviewProcess;
