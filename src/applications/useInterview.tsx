import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type {
  Interview as DbInterview,
  InterviewRound as DbInterviewRound
} from '../types';

export type InterviewRound = Pick<
  DbInterviewRound,
  'created_at' | 'company_response' | 'job_seeker_response'
>;

export type Interview = Pick<DbInterview, 'created_at'> & {
  rounds: Array<InterviewRound>;
};

export type InterviewH = {
  interview: Interview | undefined;
  isPending: boolean;
  error?: Error;
};

const useInterview = ({
  applicationId
}: {
  applicationId: number;
}): InterviewH => {
  const queryKey = useMemo(
    () => ['interviews', { applicationId }],
    [applicationId]
  );

  const { data, isPending, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await supabase
        .from('interviews')
        .select(
          `created_at, interview_rounds!inner(created_at, company_response, job_seeker_response)`
        )
        .filter('application_id', 'eq', applicationId);
      // console.log(data);
      return data;
    }
  });

  const interview = useMemo(() => {
    const interview = data?.[0];
    if (!interview) {
      return;
    }
    return {
      created_at: interview.created_at,
      rounds: interview.interview_rounds
    };
  }, [data]);

  return {
    interview,
    isPending,
    error: error ?? undefined
  };
};

export default useInterview;
