import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type {
  Interview as DbInterview,
  InterviewRound as DbInterviewRound
} from '../types';

export type InterviewRound = Pick<
  DbInterviewRound,
  'round' | 'company_response' | 'job_seeker_response'
>;

export type Interview = Pick<DbInterview, 'id'> & {
  rounds: Array<InterviewRound>;
};

export type InterviewH = {
  interview: Interview | undefined;
  isPending: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
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

  const { data, isPending, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await supabase
        .from('interviews')
        .select(
          `id,
          interview_rounds!inner(round, company_response, job_seeker_response)`
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
      id: interview.id,
      rounds: interview.interview_rounds
    };
  }, [data]);

  return {
    interview,
    isPending,
    error: error ?? undefined,
    refetch
  };
};

export default useInterview;
