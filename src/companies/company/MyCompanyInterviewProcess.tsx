import _, { capitalize } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import type { Company } from '../../Context';
import EditButtons from '../../controls/EditButtons';
import Error from '../../Error';
import supabase from '../../utils/supabase';
import { isValidInterviewProcess } from '../utils';
import InterviewProcessInput from './InterviewProcessInput';
import { formatType, type InterviewProcess } from './utils';

export type MyCompanyInterviewProcessProps = {
  company: Company;
};

const process: InterviewProcess = {
  rounds: [
    {
      type: 'recruiter',
      location: 'phone',
      duration: 0.5,
      durationUnit: 'hour'
    },
    {
      type: 'hr',
      location: 'video',
      duration: 0.5,
      durationUnit: 'hour'
    },
    {
      type: 'technical',
      location: 'video',
      duration: 1,
      durationUnit: 'hour'
    },
    {
      type: 'take_home',
      location: 'offline',
      duration: 7,
      durationUnit: 'day'
    },
    {
      type: 'management',
      location: 'video',
      duration: 0.75,
      durationUnit: 'hour'
    }
  ]
};

const MyCompanyInterviewProcess = ({
  company
}: MyCompanyInterviewProcessProps) => {
  const [editInterviewProcess, setEditInterviewProcess] =
    useState<InterviewProcess>(process);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const isDirty = useMemo(
    () => !_.isEqual(process, editInterviewProcess),
    [editInterviewProcess]
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
      <div className="whitespace-pre-wrap">
        {/* {JSON.stringify(process, null, 2)} */}
      </div>
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
          onEdit={() => setEditInterviewProcess(process)}
          onSave={updateInterviewProcess}
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
                <InterviewProcessInput
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
