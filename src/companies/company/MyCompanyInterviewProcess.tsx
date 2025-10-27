import _ from 'lodash';
import { useCallback, useContext, useMemo, useState } from 'react';
import ActionMenuContainer from '../../containers/ActionMenuContainer';
import { CompanyContext, type Company } from '../../Context';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import supabase from '../../db/supabase';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
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
        return;
      }

      const { error: jobsErr } = await supabase
        .from('jobs')
        .update({ interview_process: editInterviewProcess })
        .match({
          company_id: company.id,
          status: 'draft'
        });
      if (jobsErr) {
        console.log(jobsErr);
        setError(jobsErr);
        return;
      }

      setCompany(toUpdate);
    } finally {
      setIsSubmitting(false);
    }
  }, [company, editInterviewProcess, setCompany]);

  return (
    <>
      <ActionMenuContainer
        justify={isEditing ? 'justify-between' : 'justify-end'}
      >
        {isEditing && (
          <div className="text-sm content-center">
            Saving will also update the interview process for unpublished jobs
          </div>
        )}
        <div className="flex items-center">
          <EditDeleteIcons
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
      </ActionMenuContainer>
      <div className="h-full px-4 pb-10 pt-4 overflow-auto ">
        {error && <JobvanaError error={error} />}
        {isSubmitting && <Modal type="updating" />}
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
