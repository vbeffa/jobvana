import _, { capitalize } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import type { Company } from '../../Context';
import EditButtons from '../../controls/EditButtons';
import Error from '../../Error';
import UpdatingModal from '../../UpdatingModal';
import supabase from '../../utils/supabase';
import { isValidInterviewProcess } from '../utils';
import InterviewRoundInput from './InterviewRoundInput';
import { formatType, type InterviewProcess } from './utils';

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
    console.log('update');
    if (!isValidInterviewProcess(editInterviewProcess)) {
      return;
    }

    setIsSubmitting(true);
    setError(undefined);
    try {
      const { data, error } = await supabase
        .from('companies')
        .update({
          ...company,
          interview_process: editInterviewProcess
        })
        .eq('id', company.id)
        .select();

      if (error) {
        console.log(error);
        setError(error);
      } else {
        // console.log(data);
        setEditInterviewProcess(data[0].interview_process as InterviewProcess);
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
            console.log(isEditing);
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
          onSave={() => {
            console.log('save');
            updateInterviewProcess();
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        {!isEditing &&
          editInterviewProcess.rounds.map((round, idx) => {
            return (
              <div key={idx} className="grid grid-cols-[10%_18%_10%_10%] gap-2">
                <div>Round {idx + 1}</div>
                <div>{formatType(round.type)}</div>
                <div>{capitalize(round.location)}</div>
                <div>
                  {round.duration} {round.durationUnit}
                  {round.duration !== 1 && 's'}
                </div>
              </div>
            );
          })}

        {isEditing &&
          editInterviewProcess.rounds.map((round, idx) => {
            return (
              <div
                key={idx}
                className="grid grid-cols-[10%_20%_15%_17%_12%] gap-2"
              >
                <div className="content-center">Round {idx + 1}</div>
                <InterviewRoundInput
                  round={round}
                  idx={idx}
                  onChange={(round) => {
                    setEditInterviewProcess((process) => {
                      const updatedProcess = _.cloneDeep(process);
                      updatedProcess.rounds[idx] = round;
                      return updatedProcess;
                    });
                  }}
                />
              </div>
            );
          })}
      </div>
    </>
  );
};

export default MyCompanyInterviewProcess;
